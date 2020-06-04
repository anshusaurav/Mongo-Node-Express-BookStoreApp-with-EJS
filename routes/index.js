var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) =>{
  // console.log(req.catForHeader);
  res.redirect('/books');
});
router.get('/home', auth.isLoggedin, (req, res, next) =>{
  res.render('home');
});

module.exports = router;
