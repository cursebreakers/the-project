////// app.js

const createError = require('http-errors');
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const logger = require('morgan');
const fs = require('fs');
const marked = require('marked');


require('dotenv').config()

const appRouter = require('./routes/router')

const appServer = "http://localhost:6969"

const { connectDB } = require('./controllers/mongo');

async function serverLive() {
  try {
    await connectDB();
      console.log('Application server is live at:', appServer)
  } catch (error) {
    console.error('Server not started:', error)
  }
}

console.log('Waiting for network...')
serverLive()

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

store.on('error', function(error) {
  console.error('Session store error:', error);
});

// Initialize Express app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Initialize Passport.js
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use('/', appRouter)

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