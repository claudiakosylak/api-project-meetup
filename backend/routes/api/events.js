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

    // console.log("event", event)

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

    console.log("attendees", attendees)

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
        status: "pending"
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

    console.log(newImage)

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
        }
    ]
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
    currentTime = currentTime.toDateString();
    console.log("currentTime", currentTime)

    let startDateUsable = new Date(startDate).toDateString();
    let endDateUsable = new Date(endDate).toDateString();

    const errors = {};
    if (!venueId) errors.venueId = "Venue does not exist";
    if (!name || name.length < 5) errors.name = "Name must be at least 5 characters";
    if (type !== "Online" && type !== "In Person") errors.type = "Type must be Online or In Person";
    if (!Number.isInteger(capacity)) errors.capacity = "Capacity must be an integer";
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
        return res.json({"message": "Forbidden"})
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

    attendance.destroy()

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

    event.destroy()

    return res.json({"message": "Successfully deleted"})
})

router.get("/", async (req, res) => {
    const events = await Event.findAll({
        attributes: ["id", "groupId", "venueId", "name", "type", "startDate", "endDate"],
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

        console.log("prevImage", prevImage)
        if (prevImage) {
            event.dataValues.previewImage = prevImage.url;
        } else {
            event.dataValues.previewImage = null;
        }

    }

    console.log("events:", events);

    return res.json(events);
})


router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
