const express = require('express');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();


router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
