var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) =>{
  res.render('index', { title: 'Express' });
});
router.get('/home', auth.isLoggedin, (req, res, next) =>{
  res.render('home');
});

module.exports = router;
