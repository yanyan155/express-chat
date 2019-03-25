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

/*mongoose.connect('mongodb://localhost/test-cat', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  var kittySchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true,
      required: true
    }
  });
  kittySchema.methods.speak = function () {
    var greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
    console.log(greeting);
  }
  var Kitten = mongoose.model('Kitten', kittySchema);

  var silence = new Kitten({ name: 'Silence' });
  var fluffy = new Kitten({ name: 'fluffy' });
  
  fluffy.speak();
  console.log(silence.name);

  fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);
  });
  silence.save(function (err, fluffy) {
    if (err) return console.error(err);
  });

  Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
  })
});*/