const express = require('express');
const router = express.Router();
const logger = require('../libs/logger');
const mongoose = require('../libs/mongoose');
const User = require('../models/user');
const HttpError = require('../error');

router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Chat',
    description: 'welcome to personal chat!',
    showAutorization: true
  });
});

// ПЕРЕНЕСТИ ЛОГИКУ В ЮЗЕРА

router.post('/', function (req, res, next) {
  let bodyJson;
  for(key in req.body) {
    bodyJson = key;
  }
  let body = JSON.parse(bodyJson);

  findUser('name', body.name)
  .then(user => {
    if(!user) {
      let user = new User ({name: body.name, password: body.password});
      saveUser(user)
      .then(resolve => {

        req.session.userId = user._id;
        res.end();
      })
    } else {
      if(user.checkPassword(body.password)) {

        req.session.userId = user._id;
        res.end();
      } else {
        next(new HttpError(403, 'wrong password'));
      }
    }
  })
  .catch(err => next(err));
})

module.exports = router;

function findUser(key , parametr) {

  const find = {};
  find[key] = parametr;

  return new Promise(function(resolve, reject) {
    User.findOne(find, (err, user) => {

      if (err) {
        reject(err);
        closeConnection();
      }else {
        resolve(user);
      };
    })
  });
}

function saveUser(user) {

  return new Promise(function(resolve, reject) {

    user.save((err, user) => {
      if (err) {
        reject(err);
        closeConnection();
      }else {
        resolve(user);
      };
    })
  });
}