const express = require('express');
const router = express.Router();
const logger = require('../libs/logger');

const socket = require('../socket');

router.post('/', function(req, res, next) {

  let sid = req.session.userId;
  req.session.destroy(function(err) {
    socket.emit('upgrade', req, sid);
    if(err) {
      next(err);
    }
    res.end();
  });
});

module.exports = router;