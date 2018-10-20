const express = require('express');

const { handleGetResponse } = require('../common/handlers/response.handler');
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
 */
router.get('/characters', (req, res, next) => {
  handleGetResponse(res, next, characterService.getAllCharacters())
});

module.exports = router;
