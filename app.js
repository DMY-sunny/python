var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;

var index = require('./routes/index');
var users = require('./routes/users');
var landpageManager = require('./routes/landpageManager');
var youle=require('./routes/youle');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/landpageManager',landpageManager);
app.use('/landpageManager/youle',youle);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

var url_84='mongodb://yushan:yushan@dds-2zeb988243f9a8a41.mongodb.rds.aliyuncs.com:3717/yushan?readPreference=secondaryPreferred';
//var url_84='mongodb://yushan:yushan@101.200.174.136:10222/yushan?readPreference=secondaryPreferred';

MongoClient.connect(url_84, function(err, db) {


  if(err){
    console.log('mongodb error, please check the db '+err);
    app.locals.db = null;

  }
  else {
    console.log("Connected correctly to server");
    app.locals.db = db;
  }
});

module.exports = app;
