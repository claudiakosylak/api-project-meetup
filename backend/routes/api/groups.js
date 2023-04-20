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

router.get("/:groupId/events", async (req, res) => {
    const { groupId } = req.params;
    const currentGroup = await Group.findAll({
        where: {
            id: groupId
        }
    });

    if (currentGroup.length === 0) {
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
        event.dataValues.previewImage = image.url;
    };
    return res.json({"Events": events})
});

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

    const membGroup = membershipGroups.map(membership => {
        return membership.dataValues.Group
    });

    if (membGroup.length > 1) {
        groups.concat(membGroup);
    };

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

    console.log(newImage)

    return res.json({
        "id": newImage.dataValues.id,
        "url": newImage.dataValues.url,
        "preview": newImage.dataValues.preview
    });
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

    group.destroy();
    return res.json({"message": "Successfully deleted"})
})

router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
