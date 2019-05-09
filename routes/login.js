const express = require('express');
const router = express.Router();
const logger = require('../libs/logger');
const User = require('../models/user');

router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Chat',
    description: 'welcome to personal chat!',
    showAutorization: true
  });
});

router.post('/', function (req, res, next) {
  let bodyJson;
  for(key in req.body) {
    bodyJson = key;
  }
  let body = JSON.parse(bodyJson);

  User.authorize(body.name, body.password, function(err, user) {
    if(err) {
      next(err);
    } else {
      req.session.userId = user._id;
      res.end();
    }
  })
})

module.exports = router;
