'use strict';
const scorecard = require('../src/hotshot/routes');

module.exports = function (app) {
    app.use('/hotshot', scorecard);

    app.use('*', (_, res) => {
        res.status(404);
    });
};