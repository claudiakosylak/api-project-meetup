const express = require('express');
const { Op } = require('sequelize');
const { Group } = require('../../db/models');
const { Membership } = require('../../db/models');
const { GroupImage } = require('../../db/models');
const { Event } = require('../../db/models');
const { Venue } = require('../../db/models');
const { Attendance } = require('../../db/models');
const { EventImage, User } = require('../../db/models');

const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get("/:groupId/members", async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    });

    if (!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    };

    const memberships = await Membership.findAll({
        where: {
            groupId: groupId
        },
        include: {
            model: User
        }
    })

    const userMemb = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: groupId,
            status: "co-host"
        }
    })

    const userMembReformat = memberships.map(membership => {
        return {
            id: membership.User.id,
            firstName: membership.User.firstName,
            lastName: membership.User.lastName,
            Membership: {
                status: membership.status
            }
        }
    })

    const nonAuthResult = userMembReformat.filter(user => {
        return user.Membership.status !== "pending";
    })

    if (group.organizerId !== req.user.id && !userMemb) {
        return res.json({"Members": nonAuthResult})
    }

    return res.json({"Members": userMembReformat});
})

router.get("/:groupId/venues", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    });

    if (!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    };

    const memberships = await Membership.findAll({
        where: {
            userId: req.user.id,
            groupId: groupId,
            status: "co-host"
        }
    })

    if ((group.organizerId !== req.user.id) && !memberships) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    const groupVenues = await Venue.findAll({
        where: {
            groupId: groupId
        },
        attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"]
    })

    return res.json({"Venues": groupVenues});
})

router.get("/:groupId/events", async (req, res) => {
    const { groupId } = req.params;
    const currentGroup = await Group.findOne({
        where: {
            id: groupId
        }
    });

    if (!currentGroup) {
        res.status(404);
        return res.json({ "message": "Group couldn't be found"})
    }


    const events = await Event.findAll({
        attributes: ["id", "groupId", "venueId", "name", "type", "startDate", "endDate"],
        include: [{
            model: Group,
            attributes: ["id", "name", "city", "state"]
        }, {
            model: Venue,
            attributes: ["id", "city", "state"]
        }],
        where: {
            groupId: groupId
        }
    });

    for (let event of events) {
        const attendances = await Attendance.count({
            where: {
                eventId: event.id
            }
        });
        event.dataValues.numAttending = attendances;

        const image = await EventImage.findOne({
            where: {
                eventId: event.id,
                preview: true
            }
        });
        if (image) {
            event.dataValues.previewImage = image.url;
        } else event.dataValues.previewImage = null;
    };
    return res.json({"Events": events})
});

router.get("/current", requireAuth, async (req, res) => {
    const groups = await Group.findAll({
        attributes: ["id", "organizerId", "name", "about", "type", "private", "city", "state", "createdAt", "updatedAt"],
        where: {
            organizerId: req.user.id
        }
    });

    const membershipGroups = await Membership.findAll({
        attributes: ["id", "userId", "groupId"],
        where: {
            userId: req.user.id
        },
        include: {
            model: Group
        }
    });

    if (membershipGroups.length > 0) {
        for (let membership of membershipGroups) {
            groups.push(membership.Group)
        }
    }


    for (let group of groups) {
        let id = group.id;
        const members = await Membership.count({
            where: {
                groupId: id
            }
        });

        group.dataValues.numMembers = members;
        const preview = await GroupImage.findOne({
            where: {
                groupId: {
                    [Op.eq]: id
                },
                preview: {
                    [Op.eq]: true
                }
            }
        });
        if (preview) {
            group.dataValues.previewImage = preview.url
        } else group.dataValues.previewImage = null;

    }

    return res.json({"Groups": groups});

})

router.get("/:groupId", async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findOne({
        where: {
            id: groupId
        },
        include: [{
            model: GroupImage,
            attributes: ["id", "url", "preview"]
        },
        {
                model: Venue,
                attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"]
        },
        {
            model: User,
            as: "Organizer",
            attributes: ["id", "firstName", "lastName"]
        }
    ],
        });

    if (!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    }

    const members = await Membership.count({
        where: {
            groupId: groupId
        }
    })

    group.dataValues.numMembers = members;

    return res.json(group)

})



router.get("/", async (req, res) => {
    const groups = await Group.findAll({
        attributes: ["id", "organizerId", "name", "about", "type", "private", "city", "state", "createdAt", "updatedAt"]
    });
    for (let group of groups) {
        let id = group.id;
        const members = await Membership.count({
            where: {
                groupId: id
            }
        });

        group.dataValues.numMembers = members;
        const preview = await GroupImage.findOne({
            where: {
                groupId: {
                    [Op.eq]: id
                },
                preview: {
                    [Op.eq]: true
                }
            }
        });
        if (preview) {
            group.dataValues.previewImage = preview.url
        } else group.dataValues.previewImage = null;

    }
    return res.json({ "Groups": groups});
});

router.post("/:groupId/membership", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })

    if (!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    }

    const userMembership = await Membership.findOne({
        where: {
            groupId: groupId,
            userId: req.user.id
        }
    })

    if (group.organizerId === req.user.id) {
        res.status(400);
        return res.json({"message": "User is already a member of the group"})
    }

    if (userMembership) {
        if (userMembership.status === "pending") {
            res.status(400);
            return res.json({"message": "Membership has already been requested"})
        }

        if (userMembership.status === "co-host" || userMembership.status === "member") {
            res.status(400);
            return res.json({"message": "User is already a member of the group"})
        }

    }

    const newMembership = await Membership.create({
        userId: req.user.id,
        groupId: groupId,
        status: "pending"
    })

    return res.json({
        "memberId": req.user.id,
        "status": "pending"
    })

})

router.put("/:groupId/membership", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const { memberId, status } = req.body;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })

    if (status === "pending") {
        res.status(400);
        return res.json({"message": "Cannot change a membership status to pending"})
    }

    if (!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    }

    const requestUser = await User.findOne({
        where: {
            id: memberId
        }
    })

    if (!requestUser) {
        res.status(400);
        return res.json({
            "message": "Validation Error",
            "errors": {
                "memberId": "User couldn't be found"
            }
        })
    }


    const userMembership = await Membership.findOne({
        where: {
            groupId: groupId,
            userId: req.user.id,
            status: "co-host"
        }
    })

    if (group.organizerId !== req.user.id && !userMembership) {
        let err = new Error("Forbidden");
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        res.status(403);
        return res.json(err.errors)
    }

    if (group.organizerId !== req.user.id && status === "co-host") {
        let err = new Error("Forbidden");
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        res.status(403);
        return res.json(err.errors)
    }


    const changedMembership = await Membership.findOne({
        where: {
            groupId: groupId,
            userId: memberId
        }
    })

    if (!changedMembership) {
        res.status(404);
        return res.json({"message": "Membership between the user and the group does not exist"})
    }

    changedMembership.update({
        status
    });

    return res.json({
        "id": changedMembership.id,
        "groupId": groupId,
        "memberId": memberId,
        "status": changedMembership.status
    });

})

router.post("/:groupId/venues", requireAuth, async (req, res) => {
    const {groupId} = req.params;
    const { address, city, state, lat, lng } = req.body;

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    });

    if (!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    }

    const userMembership = await Membership.findOne({
        where: {
            groupId: groupId,
            userId: req.user.id,
            status: "co-host"
        }
    })

    if (group.organizerId !== req.user.id && !userMembership) {
        let err = new Error("Forbidden");
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        res.status(403);
        return res.json(err.errors)
    }

    const errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (isNaN(lat) || lat < -90 || lat > 90) errors.lat = "Latitude is not valid";
    if (isNaN(lng) || lng < -180 || lng > 180) errors.lng = "Longitude is not valid";



    if (Object.keys(errors).length > 0) {
        res.status(400)
        return res.json({
            "message": "Bad Request",
            errors
        })
    }
    const newVenue = await Venue.create({
        groupId: groupId,
        address: address,
        city: city,
        state: state,
        lat: lat,
        lng: lng
    });


    return res.json({
        "id": newVenue.id,
        "groupId": newVenue.groupId,
        "address": newVenue.address,
        "city": newVenue.city,
        "state": newVenue.state,
        "lat": lat,
        "lng": lng
    })
})

router.post("/:groupId/images", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const { url, preview } = req.body;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    });

    if (!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    }

    if (req.user.id !== group.organizerId) {
        let err = new Error("Forbidden");
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        res.status(403);
        return res.json(err.errors)
    }

    const newImage = await GroupImage.create({
        groupId: groupId,
        url: url,
        preview: preview
    })

    return res.json({
        "id": newImage.dataValues.id,
        "url": newImage.dataValues.url,
        "preview": newImage.dataValues.preview
    });
})

router.post("/:groupId/events", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })

    if (!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    }

    const userMembership = await Membership.findOne({
        where: {
            groupId: groupId,
            userId: req.user.id,
            status: "co-host"
        }
    })

    if (group.organizerId !== req.user.id && !userMembership) {
        let err = new Error("Forbidden");
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        res.status(403);
        return res.json(err.errors)
    }

    const venue = await Venue.findOne({
        where: {
            id: venueId
        }
    })



    let currentTime = new Date();

    currentTime = currentTime
    console.log("currentTime", currentTime)

    let startDateUsable = new Date(startDate)
    let endDateUsable = new Date(endDate);

    console.log("startdateusable", startDateUsable)

    const errors = {};
    if (!venue) errors.venueId = "Venue does not exist";
    if (name.length < 5) errors.name = "Name must be at least 5 characters";
    if (type !== "Online" && type !== "In Person") errors.type = "Type must be Online or In Person";
    if (!Number.isInteger(capacity)) errors.capacity = "Capacity must be an integer";
    if (!price || price < 0 || isNaN(price)) errors.price = "Price is invalid";
    if (!description) errors.description = "Description is required";

    if (startDateUsable <= currentTime) errors.startDate = "Start date must be in the future";
    if (endDateUsable < startDateUsable) errors.endDate = "End date is less than start date";


    if (Object.keys(errors).length > 0) {

        res.status(400)
        return res.json({
            "message": "Bad Request",
            errors
        })
    }

    const newEvent = await Event.create({
        venueId: venueId,
        groupId: groupId,
        name: name,
        description: description,
        type: type,
        capacity: capacity,
        price: price,
        startDate: startDateUsable,
        endDate: endDateUsable
    })

    return res.json({
        "id": newEvent.id,
        "venueId": newEvent.venueId,
        "groupId": newEvent.groupId,
        "name": newEvent.name,
        "description": newEvent.description,
        "type": newEvent.type,
        "capacity": newEvent.capacity,
        "price": newEvent.price,
        "startDate": newEvent.startDate,
        "endDate": newEvent.endDate
    })

})

router.put("/:groupId", requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const { groupId } = req.params;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    });

    if (!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    }

    if (req.user.id !== group.organizerId) {
        let err = new Error("Forbidden");
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        res.status(403);
        return res.json(err.errors)
    }

    const errors = {};
    if (name.length > 60) errors.name = "Name must be 60 characters or less";
    if (about.length < 50) errors.about = "About must be 50 characters or more";
    if (type !== "Online" && type !== "In Person") errors.type = "Type must be 'Online' or 'In Person'";
    if (private !== true && private !== false) errors.private = "Private must be a boolean";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";

    if (Object.keys(errors).length > 0) {
        res.status(400)
        return res.json({
            "message": "Bad Request",
            errors
        })
    }

    group.update({
        name: name,
        about: about,
        type: type,
        private: private,
        city: city,
        state: state
    })

    return res.json(group);
})

router.post("/", requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const organizer = req.user.id;

    const errors = {};
    if (name.length > 60) errors.name = "Name must be 60 characters or less";
    if (about.length < 50) errors.about = "About must be 50 characters or more";
    if (type !== "Online" && type !== "In Person") errors.type = "Type must be 'Online' or 'In Person'";
    if (private !== true && private !== false) errors.private = "Private must be a boolean";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";

    if (Object.keys(errors).length > 0) {
        res.status(400)
        return res.json({
            "message": "Bad Request",
            errors
        })
    }

    const newGroup = await Group.create({
        organizerId: organizer,
        name: name,
        about: about,
        type: type,
        private: private,
        city: city,
        state: state
    });



    res.status(201)
    return res.json(newGroup)
})

router.delete("/:groupId/membership", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })

    if (!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    }

    const member = await User.findOne({
        where: {
            id: memberId
        }
    })

    if (!member) {
        res.status(400);
        return res.json({
            "message": "Validation Error",
            "errors": {
              "memberId": "User couldn't be found"
            }
        })
    }

    if (group.organizerId !== req.user.id && memberId !== req.user.id) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    const membership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        }
    })

    if (!membership) {
        res.status(404);
        return res.json({"message": "Membership does not exist for this User"})
    }

    await Membership.destroy({
        where: {
            id: membership.id
        }
    })

    return res.json({"message": "Successfully deleted membership from group"})

})

router.delete("/:groupId", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })

    if (!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    }

    if (group.organizerId !== req.user.id) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }


    await Group.destroy({
        where: {
            id: groupId
        }
    })
    return res.json({"message": "Successfully deleted"})
})

router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
