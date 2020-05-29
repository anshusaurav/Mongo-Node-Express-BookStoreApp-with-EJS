var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();
var mongoose = require('mongoose');
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var sassMiddleware = require('node-sass-middleware');

var Category = require('./models/category');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var booksRouter = require('./routes/books')

mongoose.connect('mongodb://localhost/pustaka-db',
{useNewUrlParser: true, useUnifiedTopology: true},
 (err, db)=>{
  // var cats = ["Literature & Fiction", 
  //             "Self-Help",
  //             "Business & Economics",
  //             "Romance",
  //             "Crime, Thriller & Mystery",
  //             "Indian Writing"];
  // var data = await Category.remove({});
  // cats.forEach(async(category) =>{
  //   var newCat = await Category.create({categoryName: category, books:[]});
  // });
  console.log("connected", err? err:true);
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var srcPath = __dirname + '/public';
var destPath = __dirname + '/public';
app.use(sassMiddleware({
  src: srcPath,
  dest: destPath,
  debug: true,
  outputStyle: 'extended'
}));


app.use(session({
  secret:"secret",
  resave:false,
  saveUninitialized:false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// logged users

const loggedSession = require("./middlewares/auth");
app.use(loggedSession.loggedSession);



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
var auth = require('./middlewares/auth');
app.use('/admin',  auth.isAdminUser, adminRouter);

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
  res.status(err.status || 500).render('error');
});

module.exports = app;
