const express = require('express');
const { Event, Group, Venue, Attendance, EventImage, Membership, User } = require('../../db/models');
const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();


router.get("/:eventId/attendees", async (req, res) => {
    const { eventId } = req.params;

    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group
        }
    })

    if (!event) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }

    const attendees = await Attendance.findAll({
        where: {
            eventId: eventId
        },
        include: {
            model: User
        }
    })

    const userMemb = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: event.Group.id,
            status: "co-host"
        }
    })

    const userAttendReformat = attendees.map(attendance => {
        return {
            id: attendance.User.id,
            firstName: attendance.User.firstName,
            lastName: attendance.User.lastName,
            Attendance: {
                status: attendance.status
            }
        }
    })

    const nonAuthResult = userAttendReformat.filter(user => {
        return user.Attendance.status !== "pending";
    })

    if (event.organizerId !== req.user.id && !userMemb) {
        return res.json({"Attendees": nonAuthResult})
    }

    return res.json({"Attendees": userAttendReformat})
})

router.post("/:eventId/attendance", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })

    if (!event) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }

    const membershipAuth = await Membership.findOne({
        where: {
            groupId: event.Group.id,
            userId: req.user.id,
            status: {
                [Op.or]: ["co-host", "member"]
            }
        }
    })

    if (!membershipAuth) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    const userAttendance = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: req.user.id
        }
    })

    if (userAttendance) {
        if (userAttendance.status === "pending") {
            res.status(400);
            return res.json({"message": "Attendance has already been requested"})
        }

        if (userAttendance.status === "attending" || userAttendance.status === "waitlist") {
            res.status(400);
            return res.json({"message": "User is already an attendee of the group"})
        }

    }

    const newAttendance = await Attendance.create({
        userId: req.user.id,
        eventId: eventId,
        status: "attending"
    })

    return res.json({
        "userId": newAttendance.userId,
        "status": newAttendance.status
    })


})

router.post("/:eventId/images", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const { url, preview } = req.body;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group
        }
    })

    if (!event) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }

    const membership = await Membership.findAll({
        where: {
            userId: req.user.id,
            groupId: event.Group.id,
            status: "co-host"
        }
    })

    const attendee = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: req.user.id,
            status: "attending"
        }
    })

    if (event.Group.organizerId !== req.user.id && membership.length === 0 && !attendee) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    const newImage = await EventImage.create({
        eventId: eventId,
        url: url,
        preview: preview
    })

    return res.json({
        "id": newImage.id,
        "url": newImage.url,
        "preview": newImage.preview
    });

})

router.put("/:eventId/attendance", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const { userId, status } = req.body;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })

    if (status === "pending") {
        res.status(400);
        return res.json({"message": "Cannot change an attendance status to pending"})
    }

    if (!event) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }

    const userMembership = await Membership.findOne({
        where: {
            groupId: event.Group.id,
            userId: req.user.id,
            status: "co-host"
        }
    })

    if (event.Group.organizerId !== req.user.id && !userMembership) {
        let err = new Error("Forbidden");
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        res.status(403);
        return res.json(err.errors)
    }

    const requestUser = await User.findOne({
        where: {
            id: userId
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

    const changedAttendance = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: userId
        }
    })

    if (!changedAttendance) {
        res.status(404);
        return res.json({"message": "Attendance between the user and the event does not exist"})
    }

    changedAttendance.update({
        status
    });

    return res.json({
        "id": changedAttendance.id,
        "eventId": eventId,
        "userId": req.user.id,
        "status": changedAttendance.status
    })

})

router.get("/:eventId", async (req, res) => {
    const { eventId } = req.params;

    const event = await Event.findOne({
        where: {
            id: eventId
        },
        attributes: ["id", "groupId", "venueId", "name", "description", "type", "capacity", "price", "startDate", "endDate"],
        include: [{
            model: Group,
            attributes: ["id", "name", "private", "city", "state"]
        },
        {
            model: Venue,
            attributes: ["id", "address", "city", "state", "lat", "lng"]
        },
        {
            model: EventImage,
            attributes: ["id", "url", "preview"]
        }]
    })



    if (!event) {
        res.status(404);
        res.json({"message": "Event couldn't be found"})
    }

    const attending = await Attendance.count({
        where: {
            eventId: eventId
        }
    })

    event.dataValues.numAttending = attending;

    return res.json(event)
})

router.put("/:eventId", requireAuth, async (req, res) => {
    const { eventId } = req.params;

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })

    if (!event) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }

    const memberships = await Membership.findAll({
        where: {
            groupId: event.Group.id,
            userId: req.user.id,
            status: "co-host"
        }
    })

    if (event.Group.organizerId !== req.user.id && memberships.length === 0) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    let currentTime = new Date();
    currentTime = currentTime;

    let startDateUsable = new Date(startDate);
    let endDateUsable = new Date(endDate);

    const errors = {};
    if (!venueId) errors.venueId = "Venue does not exist";
    if (!name || name.length < 5) errors.name = "Name must be at least 5 characters";
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

    event.update({
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    })


    res.json({
        "id": event.id,
        "groupId": event.Group.id,
        "venueId": event.venueId,
        "name": event.name,
        "type": event.type,
        "capacity": event.capacity,
        "price": event.price,
        "description": event.description,
        "startDate": event.startDate,
        "endDate": event.endDate
    })


})

router.delete("/:eventId/attendance", requireAuth, async (req, res) => {
    const {eventId} = req.params;
    const {userId} = req.body;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })

    if (!event) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }

    const attendee = await User.findOne({
        where: {
            id: userId
        }
    })

    if (!attendee) {
        res.status(400);
        return res.json({
            "message": "Validation Error",
            "errors": {
              "memberId": "User couldn't be found"
            }
        })
    }

    if (event.Group.organizerId !== req.user.id && userId !== req.user.id) {
        res.status(403);
        return res.json({"message": "Only the User or organizer may delete an Attendance"})
    }

    const attendance = await Attendance.findOne({
        where: {
            userId: userId,
            eventId: eventId
        }
    })

    if (!attendance) {
        res.status(404);
        return res.json({"message": "Attendance does not exist for this User"})
    }

    await Attendance.destroy({
        where: {
            id: attendance.id
        }
    })

    return res.json({"message": "Successfully deleted attendance from event"})

})

router.delete("/:eventId", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })

    if (!event) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }

    const memberships = await Membership.findAll({
        where: {
            groupId: event.Group.id,
            userId: req.user.id,
            status: "co-host"
        }
    })

    if (event.Group.organizerId !== req.user.id && memberships.length === 0) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    await Event.destroy({
        where: {
            id: eventId
        }
    })

    return res.json({"message": "Successfully deleted"})
})

router.get("/", async (req, res) => {
    let { page, size, name, type, startDate } = req.query;
    const where = {};
    const errors = {};


    if (!page) page = 1;
    if (!size) size = 20;


    if (page < 1) errors.page = "Page must be greater than or equal to 1";
    if (size < 1) errors.size = "Size must be greater than or equal to 1";
    if (isNaN(page)) page = 1;
    if (isNaN(size)) size = 20;
    if (name && typeof name !== "string") errors.name = "Name must be a string";
    if (type && type !== "Online" && type !== "In Person") errors.type = "Type must be 'Online' or 'In Person'";
    if (startDate && isNaN(Date.parse(startDate))) errors.startDate = "Start date must be a valid datetime";

    if (page > 10) page = 10;
    if (size > 20) size = 20;

    if (Object.keys(errors).length > 0) {
        res.status(400)
        return res.json({
            "message": "Bad Request",
            errors
        })
    }

    page = parseInt(page);
    size = parseInt(size);


    if (name) where.name = name;
    if (type) where.type = type;
    if (startDate) where.startDate = startDate;

    const events = await Event.findAll({
        attributes: ["id", "groupId", "venueId", "name", "type", "startDate", "endDate"],
        where,
        limit: size,
        offset: size * (page - 1),
        include: [{
            model: Group,
            attributes: ["id", "name", "city", "state"]
        },
    {
        model: Venue,
        attributes: ["id", "city", "state"]
    }]
    })

    for (let event of events) {
        const attendances = await Attendance.count({
            where: {
                eventId: event.id
            }
        })

        event.dataValues.numAttending = attendances;

        const prevImage = await EventImage.findOne({
            where: {
                eventId: event.id,
                preview: true
            }
        })

        if (prevImage) {
            event.dataValues.previewImage = prevImage.url;
        } else {
            event.dataValues.previewImage = null;
        }

    }

    return res.json({"Events": events});
})


router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
