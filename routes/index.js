var express = require('express');
var router = express.Router();
const logger = require('../libs/logger');

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.debug('Debug statement');
  logger.info('Info statement');
  res.render('index', { 
    title: 'Chat',
    description: 'welcome to personal chat!'});
});

module.exports = router;
