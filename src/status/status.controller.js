const express = require('express');
const { name, version } = require('../../package');

const router = express.Router();

/**
 * @swagger
 * /status:
 *  get:
 *    description: get server status
 *    tags:
 *      - Status
 *    responses:
 *      200:
 *        description: when server is alive
 */
router.get('/status', (req, res) => {
  res.json({
    name,
    version,
    status: 'ok'
  });
});

module.exports = router;
