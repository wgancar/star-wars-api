const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config/config');
const apiRoutes = require('./router');
const initSwagger = require('./swagger');
const errorHandler = require('./common/handlers/error.handler');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

initSwagger(app);

app.use(config.apiPrefix, apiRoutes);
app.use(errorHandler);

module.exports = app;
