var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
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

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
})


router.get('/wishlist', auth.isLoggedin, async(req, res, next) =>{
  var id = req.session.userId;
  try{
    var loggedInUser = await User.findById(id).populate('wishList');
    res.render('wishlist', {loggedInUser:loggedInUser});

  }
  catch(error) {
    return next(err);
  }
});


router.get('/cart', auth.isLoggedin, async(req, res, next) =>{
  var id = req.session.userId;
  
  try{
    var loggedInUser = await User.findById(id).populate('personalcart');
    console.log(loggedInUser);
    var cart = await Promise.all(
      loggedInUser.personalcart.map(async (elem) => {
        var it = await Book.findById(elem.item);
        console.log(elem.item + it.title);
        return it;
      })
    );
    loggedInUser.personalcart.forEach((elem,index)=>{
      loggedInUser.personalcart[index].item = cart[index];
      console.log(loggedInUser.personalcart[index].item.author);
    });
    // console.log(loggedInUser);
    res.render('personalCart', {loggedInUser:loggedInUser});
  }
  catch(error) {
    return next(error);
  }
  // try{
  //   console.log('asdadasda');
    // var loggedInUser = await User.findById(id).populate({ path: 'personalCart',
    //                              populate: { path: 'item' }});
    // var loggedInUser = await User.findById(id).populate({
    //   path: 'personalCart',
    //   populate: {path: 'item',model : 'Book' }
    //   });
    // var loggedInUser;
    // User.findById(id).populate('personalcart').populate('item').exec((err, loggedInUser)=>{
    //   if(err)
    //     return next(err);
    //   console.log(loggedInUser);
    //   res.render('personalCart', {loggedInUser:loggedInUser});
    // });
    

  // }
  // catch(error) {
  //   return next(error);
  // }
});

module.exports = router;