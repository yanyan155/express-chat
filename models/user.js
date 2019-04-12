const mongoose = require('../libs/mongoose');
const crypto = require('crypto');

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
schema.methods.encript = function(password){
  return crypto.createHmac('sha512', this.salt).update(password).digest('hex');
};

schema.methods.checkPassword = function(password){
  return this.encript(password) === this.hashedPassword;
};

schema.virtual('password').
  get(function() { return this.plainPassword}).
  set(function(password) {
    this.plainPassword = password;
    this.salt = crypto.randomBytes(8).toString('hex').slice(0,8);
    this.hashedPassword = this.encript(password);
  });

const User = mongoose.model('User', schema);

module.exports = User;
