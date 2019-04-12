const HttpError = require('../error');

module.exports = function(req, res, next) {

  if(!req.session.userId) {
    return next(new HttpError(401, 'you aren\'t authorize'));
  }

  next();
}
