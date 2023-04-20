const express = require('express');
const { Event, Group, Venue, Attendance, EventImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

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
