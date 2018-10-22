const characterDao = require('../../src/characters/character.dao');
const { batchCharactersTestData } = require('./character.mocks');

const insertTestData = () => characterDao.insertMany(batchCharactersTestData);
const dropTestData = () => characterDao.deleteMany();

module.exports = {
  insertTestData,
  dropTestData,
};
