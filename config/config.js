const configFile = require(`${__dirname}/${process.env.NODE_ENV || 'local'}`);

module.exports = {
  env: process.env.NODE_ENV || configFile.env,
  apiPrefix: process.env.API_PREFIX || configFile.apiPrefix,
  port: process.env.PORT || configFile.port,
  publicUrl: {
    host: process.env.PUBLIC_URL_HOST || configFile.publicUrl.host,
    port: process.env.PUBLIC_URL_PORT || configFile.publicUrl.port,
    schema: process.env.PUBLIC_URL_SCHEMA || configFile.publicUrl.schema,
  }
};
