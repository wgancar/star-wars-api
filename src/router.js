const express = require('express');
const statusController = require('./status/status.controller');
const characterController = require('./characters/character.controller');

const router = express.Router();

router.use(statusController);
router.use(characterController);

module.exports = router;
