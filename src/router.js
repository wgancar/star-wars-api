const express = require('express');
const statusController = require('./status/status.controller');

const router = express.Router();

router.use(statusController);

module.exports = router;
