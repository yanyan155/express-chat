const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./libs/logger');
const HttpError = require('./error/index');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const userRouter = require('./routes/user');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.engine('ejs', require('ejs-locals').__express);

app.use(morgan('dev', {
    skip: (req, res) => { res.statusCode < 400}, 
    stream: process.stderr
}));

app.use(morgan('dev', {
    skip: (req, res) => { res.statusCode >= 400}, 
    stream: process.stdout
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./middleware/sendHttpError'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  logger.error('404 page requested');
  next(createError(404));
});

// error handler
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
