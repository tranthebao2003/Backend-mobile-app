var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var rolesRouter = require('./routes/roles');
// var permsRouter = require('./routes/permissions');
var authRouter = require('./routes/auth');
var activitiesRouter = require('./routes/activities');
var registerActivityRouter = require('./routes/register_acts');

var app = express();
const cron = require('node-cron');
const updateActivityStatus = require('./utils/updateStatus');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
// app.use('/api/v1/roles', rolesRouter);
// app.use('/api/v1/permissions', permsRouter);
app.use('/api/v1/activities', activitiesRouter);
app.use('/api/v1/register_activities', registerActivityRouter);

// Thiết lập cron job để chạy vào lúc 00:00 mỗi ngày
cron.schedule('00 0 * * *', () => {
  console.log('Running cron job to update activity status');
  updateActivityStatus();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
