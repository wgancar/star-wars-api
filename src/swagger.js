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
    host: `${config.publicUrl.host}:${config.publicUrl.port}`,
    basePath: config.apiPrefix,
    produces: [
      'application/json'
    ],
    schemes: [config.publicUrl.schema]
  },
  apis: ['./src/**/*.controller.js', './src/**/*.model.js']
};

module.exports = app => {
  app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swagger(swaggerOptions)));
};
