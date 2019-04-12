const express = require('express');
const router = express.Router();
const logger = require('../libs/logger');
const User = require('../models/user');
ObjectID = require('mongodb').ObjectID;
const HttpError = require('../error/index');

router.get('/:id', function(req, res, next) {
  try {
    let id = new ObjectID(req.params.id);
  } catch(err) {
    return next(404);
  }
  User.findById(req.params.id, function (err, user) {
    if(err) {
      next(err);
    }else if(!user) {
      next(new HttpError(404, 'user not found'));
    }else {
      res.send(user);
    }
  });
});

module.exports = router;
