const http = require('http');
const util = require('util');

function HttpError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, HttpError);

  this.message = message || http.STATUS_CODES[status] || 'Error';
  this.status = status;
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

module.exports = HttpError;