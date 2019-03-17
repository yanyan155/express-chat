var express = require('express');
var router = express.Router();
const logger = require('../config/logger');
/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.debug('Debug statement');
  logger.info('Info statement');
  res.send('respond with a resource');
});

module.exports = router;
