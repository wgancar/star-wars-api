const express = require('express');

const {
  handleGetResponse, handleCreationResponse, handleDeletionResponse, handleUpdateResponse, handleActionResponse
} = require('../common/handlers/response.handler');
const characterService = require('./character.service');
const router = express.Router();

/**
 * @swagger
 * /characters:
 *  get:
 *    description: Returns paginated star wars characters
 *    tags:
 *      - Characters
 *    parameters:
 *      - in: query
 *        name: page
 *        type: integer
 *        example: 1
 *        description: number of page to display
 *      - in: query
 *        name: pageSize
 *        type: integer
 *        example: 10
 *        description: number of elements displayed on single page
 *    responses:
 *      200:
 *        description: paginated star wars characters response
 *        schema:
 *          type: object
 *          properties:
 *            page:
 *              type: integer
 *              example: 1
 *              min: 1
 *              description: current page
 *            pageSize:
 *              type: integer
 *              example: 10
 *              min: 1
 *              description: number of elements on single page
 *            totalItems:
 *              type: integer
 *              example: 1
 *              description: count of all characters in the database
 *            totalPages:
 *              type: integer
 *              example: 1
 *              description: total pages number
 *            characters:
 *              type: array
 *              items:
 *                $ref: '#/definitions/Character'
 *
 */
router.get('/characters', (req, res, next) => {
  const { page, pageSize } = req.query;
  handleGetResponse(res, next, characterService.getAllCharacters(page, pageSize))
});

/**
 * @swagger
 * /characters:
 *  post:
 *    description: Creates new character.
 *    tags:
 *      - Characters
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: newCharacter
 *        schema:
 *          $ref: '#/definitions/CreateCharacter'
 *        required: true
 *    responses:
 *      201:
 *        description: Newly created character
 *        schema:
 *          $ref: '#/definitions/Character'
 *      400:
 *        description: validation error or character already exists
 */
router.post('/characters', (req, res, next) => {
  const newCharacter = req.body;
  handleCreationResponse(req, res, next, characterService.createCharacter(newCharacter))
});

/**
 * @swagger
 * /characters/{characterId}:
 *  get:
 *    description: Return character for given id
 *    tags:
 *      - Characters
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: characterId
 *        type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Character data
 *        schema:
 *          $ref: '#/definitions/Character'
 *      400:
 *        description: provided id is not valid ObjectId instance
 *      404:
 *        description: character with given id doesn't exist
 */
router.get('/characters/:characterId', (req, res, next) => {
  const { params: { characterId } } = req;
  handleGetResponse(res, next, characterService.getCharacterById(characterId));
});

/**
 * @swagger
 * /characters/{characterId}:
 *  delete:
 *    description: Delete character by given id
 *    tags:
 *      - Characters
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: characterId
 *        type: string
 *        required: true
 *    responses:
 *      204:
 *        description: success
 *      400:
 *        description: provided id is not valid ObjectId instance
 *      404:
 *        description: character with given id doesn't exist
 */
router.delete('/characters/:characterId', (req, res, next) => {
  const { params: { characterId } } = req;
  handleDeletionResponse(res, next, characterService.deleteCharacterById(characterId));
});

/**
 * @swagger
 * /characters/{characterId}:
 *  patch:
 *    description: Updates existing character with provided fields
 *    tags:
 *      - Characters
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: characterId
 *        type: string
 *        required: true
 *      - in: body
 *        name: updatedFields
 *        schema:
 *          $ref: '#/definitions/UpdateCharacter'
 *        required: true
 *    responses:
 *      200:
 *        description: Updated character
 *        schema:
 *          $ref: '#/definitions/Character'
 *      400:
 *        description: validation error
 *      404:
 *        description: character with given id doesn't exist
 */
router.patch('/characters/:characterId', (req, res, next) => {
  const { params: { characterId }, body: updatedFields } = req;
  handleUpdateResponse(req, res, next, characterService.updateCharacterById(characterId, updatedFields));
});

/**
 * @swagger
 * /characters/{characterId}/friends:
 *  post:
 *    description: Append character's friends
 *    tags:
 *      - Characters
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: characterId
 *        type: string
 *        required: true
 *      - in: body
 *        name: friendsToAppend
 *        schema:
 *          type: array
 *          items:
 *            type: string
 *          example: [Han Solo, Obi Wan]
 *        required: true
 *    responses:
 *      200:
 *        description: Updated character
 *        schema:
 *          $ref: '#/definitions/Character'
 *      400:
 *        description: validation error
 *      404:
 *        description: character with given id doesn't exist
 */
router.post('/characters/:characterId/friends', (req, res, next) => {
  const { params: { characterId }, body: friendsToAppend } = req;
  handleActionResponse(req, res, next, characterService.appendFriendsByCharacterId(characterId, friendsToAppend));
});

/**
 * @swagger
 * /characters/{characterId}/friends:
 *  delete:
 *    description: Remove given friends from current character's friends array
 *    tags:
 *      - Characters
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: characterId
 *        type: string
 *        required: true
 *      - in: body
 *        name: friendsToRemove
 *        schema:
 *          type: array
 *          items:
 *            type: string
 *          example: [Han Solo, Obi Wan]
 *        required: true
 *    responses:
 *      200:
 *        description: Updated character
 *        schema:
 *          $ref: '#/definitions/Character'
 *      400:
 *        description: validation error
 *      404:
 *        description: character with given id doesn't exist
 */
router.delete('/characters/:characterId/friends', (req, res, next) => {
  const { params: { characterId }, body: friendsToRemove } = req;
  handleActionResponse(req, res, next, characterService.removeFriendsByCharacterId(characterId, friendsToRemove));
});

/**
 * @swagger
 * /characters/{characterId}/episodes:
 *  post:
 *    description: Append character's episodes
 *    tags:
 *      - Characters
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: characterId
 *        type: string
 *        required: true
 *      - in: body
 *        name: episodesToAppend
 *        schema:
 *          type: array
 *          items:
 *            type: string
 *          enum: [NEWHOPE, EMIPRE, JEDI]
 *          example: [NEWHOPE]
 *        required: true
 *    responses:
 *      200:
 *        description: Updated character
 *        schema:
 *          $ref: '#/definitions/Character'
 *      400:
 *        description: validation error
 *      404:
 *        description: character with given id doesn't exist
 */
router.post('/characters/:characterId/episodes', (req, res, next) => {
  const { params: { characterId }, body: episodesToAppend } = req;
  handleActionResponse(req, res, next, characterService.appendEpisodesByCharacterId(characterId, episodesToAppend));
});

/**
 * @swagger
 * /characters/{characterId}/episodes:
 *  delete:
 *    description: Remove given episodes from current character's episodes array
 *    tags:
 *      - Characters
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: characterId
 *        type: string
 *        required: true
 *      - in: body
 *        name: episodesToRemove
 *        schema:
 *          type: array
 *          items:
 *            type: string
 *          enum: [NEWHOPE, EMIPRE, JEDI]
 *          example: [NEWHOPE]
 *        required: true
 *    responses:
 *      200:
 *        description: Updated character
 *        schema:
 *          $ref: '#/definitions/Character'
 *      400:
 *        description: validation error
 *      404:
 *        description: character with given id doesn't exist
 */
router.delete('/characters/:characterId/episodes', (req, res, next) => {
  const { params: { characterId }, body: episodesToRemove } = req;
  handleActionResponse(req, res, next, characterService.removeEpisodesByCharacterId(characterId, episodesToRemove));
});

module.exports = router;
