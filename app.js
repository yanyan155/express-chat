const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./libs/logger');
const HttpError = require('./error/index');
const session = require('express-session');
const config = require('./config/index');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('./libs/mongoose');
const socket = require('./socket');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const chatRouter = require('./routes/chat');
const usersRouter = require('./routes/users');
const userRouter = require('./routes/user');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev', {
    skip: (req, res) => { res.statusCode < 400}, 
    stream: process.stderr
}));
app.use(morgan('dev', {
    skip: (req, res) => { res.statusCode >= 400}, 
    stream: process.stdout
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = require('./libs/sessionStore');
app.use(session({
  /*genid: function(req) {
    return genuuid() // use UUIDs for session IDs, uid-safe library
  },*/
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));
/*app.use((req, res, next) => {
  req.session.visit = req.session.visit + 1 || 1;
  res.send(`visits ${req.session.visit}`);
});*/
app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/variables'));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/chat', chatRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);

app.use(function(req, res, next) {
  logger.error('404 page requested');
  next(createError(404));
});

app.use(function(err, req, res, next) {
  if(typeof err === 'number') {
    err = new HttpError(err);
  }
  if(err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');

    // here need write error in log, if req.app.get('env') !== 'development'
    // rewatch/study screencast debug video
  }
});

module.exports = app;

// start websocket: http -sid-> server save {sid:sid, key: key} 
// browser <-key- server
// browser WSS -key-> server auth complete {sid:sid, key: key} deleted after 60 sec.

