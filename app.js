var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
const fs = require('fs');
require("dotenv").config();
var mongoose = require('mongoose');
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var sassMiddleware = require('node-sass-middleware');
const Razorpay = require('razorpay');

const credentials = {
    key_id: "rzp_test_JE3MJ3VRzgt7cF",
    key_secret: "BwLBt4RpN6bsUNmyuKo35Ndh"
}
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var booksRouter = require('./routes/books');
var reviewRouter = require('./routes/review');
var categoryRouter = require('./routes/category');
var purchasesRouter = require('./routes/purchases');
var searchRouter = require('./routes/search');
var addressesRouter = require('./routes/addresses');
//'mongodb+srv://anshusaurav:3BpDAwgNI64FfiOC@cluster0-qizxp.mongodb.net/pustaka-db?retryWrites=true&w=majority'||
mongoose.connect('mongodb+srv://anshusaurav:3BpDAwgNI64FfiOC@cluster0-qizxp.mongodb.net/pustaka-db?retryWrites=true&w=majority'||'mongodb://localhost/pustaka-db',
{useNewUrlParser: true, useUnifiedTopology: true},
 (err, db)=>{
  // var cats = ["Literature & Fiction", 
  //             "Self-Help",
  //             "Business & Economics",
  //             "Romance",
  //             "Crime, Thriller & Mystery",
  //             "Indian Writing"];
  // // var data = await Category.remove({});
  // cats.forEach(async(category) =>{
  //   var newCat = await Category.create({categoryName: category, books:[]});
  // });
  console.log("connected", err? err:true);
})

var app = express();
const rzr = new Razorpay(credentials); //initialization
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
app.use(flash());
const flashMsg = require("./middlewares/flash"); 
app.use(flashMsg.flashMsg);
// logged users

const loggedSession = require("./middlewares/auth");
app.use(loggedSession.loggedSession);

const catheader = require('./middlewares/catheader');
app.use(catheader.fetchAllCategories);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/category', categoryRouter);
app.use('/search', searchRouter);
const auth = require('./middlewares/auth');
app.use('/admin',  auth.isAdminUser, adminRouter);
app.use('/review', auth.isLoggedin, reviewRouter);
app.use('/purchases', auth.isLoggedin, purchasesRouter);
app.use('/addresses', auth.isLoggedin, addressesRouter);

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
