const User = require('../models/user');

module.exports = function(req, res, next) {

  res.locals.showAutorization = false;
  res.locals.webSocket = false;
  req.user = res.locals.user = null;

  if(!req.session.userId) {
    next();
  } else {
    User.findOne({'_id': req.session.userId}, (err, user) => {

      if (err) {
        next(err);
      }else {
        req.user = res.locals.user = user;
        next();
      };
    })
  }
}
