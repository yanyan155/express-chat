const express = require('express');
const router = express.Router();
const logger = require('../libs/logger');
const checkAuth = require('../middleware/checkAuth');

router.get('/', checkAuth, function(req, res, next) {
  logger.debug('Debug statement');
  logger.info('Info statement');

  res.render('index', { 
    title: 'Chat',
    description: 'welcome to personal chat (user123) !'
  });
});

module.exports = router;