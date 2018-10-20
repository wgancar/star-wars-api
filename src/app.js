const express = require('express');
const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');

const config = require('../config/config');
const logger = require('./common/services/logger.service');
const apiRoutes = require('./router');
const initSwagger = require('./swagger');
const errorHandler = require('./common/handlers/error.handler');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bunyanMiddleware({
  logger,
}));

if (config.enableSwagger) {
  initSwagger(app);
}

app.use(config.apiPrefix, apiRoutes);
app.use(errorHandler);

module.exports = app;
