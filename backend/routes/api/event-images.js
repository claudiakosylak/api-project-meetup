const express = require('express');
const { Event, Group, Venue, Attendance, EventImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();





router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
