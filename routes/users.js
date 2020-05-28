var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var auth = require('../middlewares/auth');
/* GET users listing. */


router.post('/register', async(req, res, next) =>{
  console.log('HEREEERE');
  console.log(req.body);
  let {email} = req.body;
  try{
    var user = await User.findOne({email},'-password');
    if (!user) {
      user = await User.create(req.body);
      console.log(user);
      var cart = await Cart.create({buyer: user.id});
      console.log(cart);
      user = await User.findOneAndUpdate({email}, 
        {$set : {peronalCart: cart.id } });
      console.log(user);
      res.redirect("/users/login");
    }
    return next("Email id already in use.");
  }
  catch(error) {
    return next(error);
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
    if(user.isBlocked)  return res.redirect("/users/login");

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