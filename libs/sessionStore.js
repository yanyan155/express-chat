const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection })

module.exports = sessionStore;