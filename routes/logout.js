const express = require('express');
const router = express.Router();
const logger = require('../libs/logger');

router.post('/', function(req, res, next) {
  req.session.destroy();
  res.end();
});

module.exports = router;