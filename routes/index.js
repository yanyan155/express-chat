const express = require('express');
const router = express.Router();
const logger = require('../libs/logger');

router.get('/', function(req, res, next) {
  logger.debug('Debug statement');
  logger.info('Info statement');
  res.render('index', { 
    title: 'Chat',
    description: 'welcome to personal chat!'
  });
});

module.exports = router;
