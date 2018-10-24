const characterDao = require('../../src/characters/character.dao');
const { batchCharactersTestData } = require('./character.mocks');

const insertSingleCharacter = characterData => characterDao.create(characterData);
const dropSingleCharacterById = characterId => characterDao.findOneAndRemove({ _id: characterId });
const insertTestData = () => characterDao.insertMany(batchCharactersTestData);
const dropTestData = () => characterDao.deleteMany();

module.exports = {
  insertTestData,
  dropTestData,
  insertSingleCharacter,
  dropSingleCharacterById,
};
