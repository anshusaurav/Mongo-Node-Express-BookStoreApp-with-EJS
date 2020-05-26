var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');
/* GET users listing. */
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    err ? next(err) : res.redirect("/users/login");
  });
});

// get login

router.get("/login", (req, res) => {
  res.render("signup");
});

// verify login

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) return next("enter a valid email ID");
    if (!user.verifyPassword(password)) return res.redirect("/users/login");
    // login user by creating a session
    req.session.userId = user.id;
    res.redirect("/");
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
})

// comments 

module.exports = router;