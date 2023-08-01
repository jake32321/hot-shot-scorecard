'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { version } = require('./package.json');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add in routes
require('./routes')(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Hotshot API [v${version}]`);
    console.log(`Application listening on port ${port}`);
});
