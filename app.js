var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// REMOVAL OF JADE ENGINE + BASIC STATIC FILES 
app.use(express.static(path.join(__dirname, 'views')));

// TO SET ENV VARIABLES 
var dotenv = require('dotenv'); 
dotenv.load(); 

// TO LOAD PASSPORT
var passport = require('passport'); 
app.use(passport.initialize()); 

// CONFIGURE PASSPORT 
require('./config/passport')(passport); // Loads custom strategies 

// ATTACH SOCKET IO (see www file as well)
app.io = require('socket.io')(); 

// LOAD ALL ROUTES
var routes = require('./routes/index');
var users = require('./routes/users');
var chats = require('./routes/chats')(app.io); 

// REGISTER ROUTES 
app.use('/', routes);
app.use('/users', users);
app.use('/chats', chats); 




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
