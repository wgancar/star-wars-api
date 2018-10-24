const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../src/common/services/logger.service');

mongoose.set('useFindAndModify', false);
mongoose.set('runValidators', true);
mongoose.Promise = global.Promise;

const connection = mongoose.connection;

connection.on('connecting', () => {
  logger.info('connecting to MongoDB...');
});

connection.on('connected', () => {
  logger.info('connection established successfully')
})

connection.on('error', error => {
  logger.error(`Error in MongoDb connection: ${error}`);
});

connection.on('reconnected', () => {
  logger.info('MongoDB reconnected!');
});

connection.on('disconnected', () => {
  logger.info('MongoDB disconnected!');
});

mongoose.connect(config.mongodbUri, {
  keepAlive: true,
  useNewUrlParser: true,
  useCreateIndex: true,
}).catch(err => logger.error(err));

module.exports = connection;
