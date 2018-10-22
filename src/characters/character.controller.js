const express = require('express');

const { handleGetResponse, handleCreationResponse } = require('../common/handlers/response.handler');
const characterService = require('./character.service');
const router = express.Router();

/**
 * @swagger
 * /characters:
 *  get:
 *    description: Returns all star wars characters
 *    tags:
 *      - Characters
 *    responses:
 *      200:
 *        description: array of star wars characters
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Character'
 *
 */
router.get('/characters', (req, res, next) => {
  handleGetResponse(res, next, characterService.getAllCharacters())
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

module.exports = router;
