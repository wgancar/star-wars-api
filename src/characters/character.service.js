const characterDao = require('./character.dao');
const { validate, validateObjectId } = require('../common/services/validation.service');
const createCharacterSchema = require('./validation-schemas/create-character.schema');
const { patchObjectSchema, episodesArraySchema, friendsArraySchema } = require('./validation-schemas/update-character.schema');
const { getCharacterOptionsSchema } = require('./validation-schemas/get-character.schema');
const { throwUniqConstraintWhenConflict, throwNotFoundWhenNull, appendToDocument, removeFromDocument } = require('../common/handlers/mongoose.handler');
const ValidationError = require('../common/errors/ValidationError');

/**
 * Return paginated star wars characters object
 * @param {Integer} page
 * @param {Integer} pageSize
 * @returns {Promise<Array<Object>>}
 *    Possible rejections
 *      - ValidationError - when wrong pagination options are provided
 */
const getAllCharacters = async (page = 1, pageSize = 10) => {
  const {
    page: validatedPage, pageSize: validatedPageSize
  } = validate({ page, pageSize }, getCharacterOptionsSchema);

  const charactersCount = await characterDao.countDocuments();
  const characters = await characterDao.find()
    .skip((validatedPage - 1) * validatedPageSize)
    .limit(validatedPageSize)
    .lean();

  return {
    page: parseInt(validatedPage),
    pageSize: parseInt(validatedPageSize),
    totalItems: charactersCount,
    totalPages: Math.ceil(charactersCount / validatedPageSize),
    characters,
  };
};

/**
 * Creates new character
 * @param {{ name: string, episodes: string[], [friends]: string[], [planet]: string }} newCharacter - new character data
 * @returns {Promise<Object>}
 *   Possible rejections
 *    - ValidationError - when trying to add new character that doesn't meet validation schema
 *    - ConflictError - when trying to add new characters with name that already exists in database
 */
const createCharacter = newCharacter =>
  characterDao.create(validate(newCharacter, createCharacterSchema))
    .catch(throwUniqConstraintWhenConflict(`Character with name [ ${newCharacter.name} ] already exists, choose a different name`));

/**
 * Gets character for given id
 * @param {String} characterId - character id
 * @return {Promise<Object>} character data
 *     Possible rejections:
 *       - ValidationError - when provided character id is not valid object id
 *       - ResourceNotFoundError - when character doesn't exist
 */
const getCharacterById = characterId =>
  characterDao.findById(validateObjectId(characterId)).lean()
    .then(throwNotFoundWhenNull(`Character with [ ${characterId} ] not found`));

/**
 * Deletes character for given character id
 * @param {String} characterId - character id
 * @return {Promise<Object>} deleted character data
 *     Possible rejections:
 *       - ValidationError - when provided character id is not valid object id
 *       - ResourceNotFoundError - when character doesn't exist
 */
const deleteCharacterById = async characterId =>
  characterDao.findByIdAndDelete(validateObjectId(characterId))
    .then(throwNotFoundWhenNull(`Character with [ ${characterId} ] not found`));

/**
 * Updates character for given character id
 * @param {String} characterId - character id
 * @param {{ [name]: string, [episodes]: string[], [friends]: string[], [planet]: string }} updatedFields - updated character fields
 * @return {Promise<Object>} updated character data
 *     Possible rejections:
 *       - ValidationError - when provided character id is not valid object id or validation error
 *       - ResourceNotFoundError - when character doesn't exist
 */
const updateCharacterById = async (characterId, updatedFields) =>  {
  const validatedId = validateObjectId(characterId);
  validate(updatedFields, patchObjectSchema);

  return characterDao.findByIdAndUpdate(validatedId, updatedFields, { new: true, lean: true })
    .then(throwNotFoundWhenNull(`Character with [ ${characterId} ] not found`));
};

/**
 * Append character's friends for given character id
 * @param {String} characterId - character id
 * @param {{friends: String[]}} friendsToAppend - friends to be added to current character's friends
 * @return {Promise<Object>} updated characters array
 *     Possible rejections:
 *       - ValidationError - when provided character id is not valid object id or validation error
 *       - ResourceNotFoundError - when character doesn't exist
 */
const appendFriendsByCharacterId = async (characterId, friendsToAppend) => {
   const validatedId = validateObjectId(characterId);
   const validatedUpdateData = validate({ friends: friendsToAppend }, friendsArraySchema);

   return appendToDocument(characterDao, validatedId, validatedUpdateData)
     .then(throwNotFoundWhenNull(`Character with [ ${characterId} ] not found`));
};

/**
 * Remove character's friends for given character id
 * @param {String} characterId - character id
 * @param {{friends: String[]}} friendsToRemove - friends to be removed from current character's friends
 * @return {Promise<Object>} updated character
 *     Possible rejections:
 *       - ValidationError - when provided character id is not valid object id or validation error
 *       - ResourceNotFoundError - when character doesn't exist
 */
const removeFriendsByCharacterId = async (characterId, friendsToRemove) => {
  const validatedId = validateObjectId(characterId);
  const validatedUpdateData = validate({ friends: friendsToRemove }, friendsArraySchema);

  return removeFromDocument(characterDao, validatedId, validatedUpdateData)
    .then(throwNotFoundWhenNull(`Character with [ ${characterId} ] not found`));
};

/**
 * Append character's episodes for given character id
 * @param {String} characterId - character id
 * @param {{episodes: String[]}} episodesToAppend - episodes to be added to current character's episodes
 * @return {Promise<Object>} updated character
 *     Possible rejections:
 *       - ValidationError - when provided character id is not valid object id or validation error
 *       - ResourceNotFoundError - when character doesn't exist
 */
const appendEpisodesByCharacterId = async (characterId, episodesToAppend) => {
  const validatedId = validateObjectId(characterId);
  const validatedUpdateData = validate({ episodes: episodesToAppend }, episodesArraySchema);

  return appendToDocument(characterDao, validatedId, validatedUpdateData)
    .then(throwNotFoundWhenNull(`Character with [ ${characterId} ] not found`));
};

/**
 * Remove character's episodes for given character id
 * @param {String} characterId - character id
 * @param {{episodes: String[]}} episodesToRemove - episodes to be removed from current character's episodes
 * @return {Promise<Object>} updated character
 *     Possible rejections:
 *       - ValidationError - when provided character id is not valid object id or validation error
 *       - ResourceNotFoundError - when character doesn't exist
 */
const removeEpisodesByCharacterId = async (characterId, episodesToRemove) => {
  const validatedId = validateObjectId(characterId);
  const validatedUpdateData = validate({ episodes: episodesToRemove }, episodesArraySchema);

  const character = await characterDao.findById(validatedId).lean()
    .then(throwNotFoundWhenNull(`Character with [ ${characterId} ] not found`));

  const episodesLeftAfterUpdate = character.episodes.filter(episode => !episodesToRemove.includes(episode));
  if (episodesLeftAfterUpdate.length === 0) {
    throw new ValidationError('Cannot remove episode, character has to have at least one episode assigned')
  }

  return removeFromDocument(characterDao, validatedId, validatedUpdateData);
};

module.exports = {
  getAllCharacters,
  createCharacter,
  getCharacterById,
  deleteCharacterById,
  updateCharacterById,
  appendEpisodesByCharacterId,
  appendFriendsByCharacterId,
  removeEpisodesByCharacterId,
  removeFriendsByCharacterId,
};
