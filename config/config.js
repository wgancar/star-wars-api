const configFile = require(`${__dirname}/${process.env.NODE_ENV || 'local'}`);

module.exports = {
  port: process.env.PORT || configFile.port || 3000,
};
