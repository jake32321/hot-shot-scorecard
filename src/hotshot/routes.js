'use strict';
const express = require('express');
const controller = require('./controller')

const router = express.Router();

router.post(
    '/calculate-scorecard',
    (req, res) => {
        const scorecard = controller.buildScoreCard(req.body);
        return res.json({ scorecard });
    }
);

module.exports = router;
