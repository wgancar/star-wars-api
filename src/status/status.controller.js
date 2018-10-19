const express = require('express');
const { name, version } = require('../../package');

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    name,
    version,
    status: 'ok'
  });
});

module.exports = router;
