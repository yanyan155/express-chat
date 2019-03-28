const express = require('express');
const router = express.Router();
const logger = require('../libs/logger');
const mongoose = require('../libs/mongoose');
const User = require('../models/user');

router.get('/', function(req, res, next) {
  logger.debug('Debug statement');
  logger.info('Info statement');

  User.find({}, (err, docs)=> {
    if(docs) {
      logger.info('users find successful');
      logger.info(`${req}`);
      res.json(docs);
    } else if(err) {
      next(err);
    }
  });
});

module.exports = router;
