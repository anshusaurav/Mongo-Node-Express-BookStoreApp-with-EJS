var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');
/* GET users listing. */
router.get("/register", (req, res) => {
  res.render("signup");
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    err ? next(err) : res.redirect("/users/login");
  });
});


router.post('/register', async(req, res, next) =>{
  let {email, password, name} = req.body;
  try{
    let user = await User.findOne({email});
    if (!user) {
      let user = await User.create(req.body);
      res.redirect("users/login");
    }
    return next("Email id already in use.");
  }
  catch(error) {
    return next(err);
  }

});

// get login

router.get("/login", (req, res) => {
  res.render("signup");
});

// verify login

router.post('/login', async(req, res, next) =>{
  let {email, password} = req.body;
  try{
    let user = await User.findOne({email}, '-password');
    if (!user) return next("enter a valid email ID");
    if (!user.verifyPassword(password)) return res.redirect("/users/login");
    req.session.userId = user.id;
    req.session.user = user;
    console.log('HERE');
    console.log(req.session.userId);
    res.redirect("/");
  }
  catch(error) {
    return next(err);
  }

});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
})


module.exports = router;