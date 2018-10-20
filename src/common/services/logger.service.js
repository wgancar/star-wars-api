const bunyan = require('bunyan');
const BunyanPrettyStream = require('bunyan-prettystream');
const config = require('../../../config/config');

const getLoggerStream = () => {
  const prettyStdOut = new BunyanPrettyStream();
  prettyStdOut.pipe(process.stdout);

 return [{
   type: 'raw',
   level: 'info',
   stream: prettyStdOut
 }]
};

module.exports = bunyan.createLogger({
  name: config.env,
  streams: getLoggerStream(),
});


