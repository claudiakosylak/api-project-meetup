const express = require('express');
const { Event, Group, Venue, Attendance, EventImage, Membership } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();


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

        event.dataValues.previewImage = prevImage.url;
    }

    console.log("events:", events);

    return res.json(events);
})


router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
