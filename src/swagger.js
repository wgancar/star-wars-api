const swagger = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const config = require('../config/config');
const { name, description, version } = require('../package');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      description,
      title: name,
      version
    },
    basePath: config.apiPrefix,
    produces: [
      'application/json'
    ],
  },
  apis: ['./src/**/*.controller.js', './src/**/*.definition.js']
};

module.exports = app => {
  app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swagger(swaggerOptions)));
};
