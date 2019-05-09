const mongoose = require('../libs/mongoose');
const crypto = require('crypto');
const HttpError = require('../error');

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

schema.statics.authorize = function (username, password, cb) {
  let User = this;
  findUser('name', username)
  .then(user => {
    if(!user) {
      let user = new User ({name: username, password: password});
      saveUser(user)
      .then(resolve => {
        return cb(null, user);
      })
    } else {
      if(user.checkPassword(password)) {
        return cb(null, user);
      } else { 
        return cb(new HttpError(403, 'wrong password'));
      }
    }
  })
  .catch(err => cb(err));
}

const User = mongoose.model('User', schema);

module.exports = User;

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
