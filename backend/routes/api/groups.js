const express = require('express');
const { Op } = require('sequelize');
const { Group } = require('../../db/models');
const { Membership } = require('../../db/models');
const { GroupImage } = require('../../db/models');

const router = express.Router();

router.get("/", async (req, res) => {
    const groups = await Group.findAll({
        attributes: ["id", "organizerId", "name", "about", "type", "private", "city", "state", "createdAt", "updatedAt"]
    });
    console.log(groups);
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
        group.dataValues.previewImage = preview.url;
    }
    return res.json({ "Groups": groups});
});

module.exports = router;
