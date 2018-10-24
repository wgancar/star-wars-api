const configFile = require(`${__dirname}/${process.env.NODE_ENV || 'local'}`);

module.exports = {
  env: process.env.NODE_ENV || configFile.env,
  apiPrefix: process.env.API_PREFIX || configFile.apiPrefix,
  enableSwagger: process.env.ENABLE_SWAGGER || configFile.enableSwagger,
  port: process.env.PORT || configFile.port,
  mongodbUri: process.env.MONGODB_URI || configFile.mongodbUri,
};
