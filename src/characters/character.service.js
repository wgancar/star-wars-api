const characterDao = require('./character.dao');
const ConflictError = require('../common/errors/ConflictError');
const { validate } = require('../common/services/validation.service');
const createCharacterSchema = require('./validation-schemas/create-character.schema');

/**
 * Return star wars characters
 * @returns {Promise<Array<Object>>}
 */
const getAllCharacters = () => {
  return characterDao.find().lean();
};

/**
 * Creates new character
 * @param {{ name: string, episodes: string[], [friends]: string[], [planet]: string
 * }} newCharacter - new character data
 * @returns {Promise<Object>}
 *   Possible rejections
 *    - ConflictError - when trying to add new characters with name that already exists in database
 */
const createCharacter = async newCharacter => {
  try {
    return await characterDao.create(validate(newCharacter, createCharacterSchema));
  } catch (error) {
    throw error.code === 11000
      ? new ConflictError(`Character with name [ ${newCharacter.name} ] already exists, choose a different name`)
      : error;
  }
};

module.exports = {
  getAllCharacters,
  createCharacter,
};
