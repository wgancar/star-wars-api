const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./router');
const errorHandler = require('./common/handlers/error.handler');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', apiRoutes);
app.use(errorHandler);

module.exports = app;
