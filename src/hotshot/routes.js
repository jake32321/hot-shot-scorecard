'use strict';
const express = require('express');
const controller = require('./controller')

const router = express.Router();

router.post(
    '/calculate-scorecard',
    (req, res) => {
        controller.buildScoreCard(res, req.body);
    }
);

module.exports = router;
