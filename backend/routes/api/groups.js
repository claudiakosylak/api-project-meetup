const express = require('express');
const { Op } = require('sequelize');
const { Group } = require('../../db/models');
const { Membership } = require('../../db/models');
const { GroupImage } = require('../../db/models');
const { Event } = require('../../db/models');
const { Venue } = require('../../db/models');
const { Attendance } = require('../../db/models');
const { EventImage } = require('../../db/models');

const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');

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

router.post("/", requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const organizer = req.user.id;
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

module.exports = router;
