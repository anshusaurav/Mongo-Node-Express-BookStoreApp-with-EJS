var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var Purchase = require('../models/purchase');
var auth = require('../middlewares/auth');
var mailer = require('../utils/mailer');


router.post('/register', async(req, res, next) =>{
  console.log('HEREEERE');
  console.log(req.body);
  let {email} = req.body;
  try{
    var user = await User.findOne({email},'-password');
    if (!user) {
      user = await User.create(req.body);
      var rand = Math.floor((Math.random() * 100) + 54);
      // var vc = await VerificationCode.create({code: rand, user: user.id});
      user.activeToken = rand;
      var link = 'http://locolhost:3000/account/active/'
                           + user.activeToken;
      console.log(user);
      // mailer.send({
      //             to: req.body.email,
      //             subject: 'Welcome',
      //             html: 'Please click <a href="' + link + '"> here </a> to activate your account.'
      // });
      // user = await User.findOneAndUpdate({email}, {$set: {activeToken: rand}});
      //flash message for confirmation mail
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
    res.redirect("/books");
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

//Display cart with book details and total price on page
router.get('/cart', auth.isLoggedin, async(req, res, next) =>{
  var id = req.session.userId;
  
  try{
    var loggedInUser = await User.findById(id).populate('personalcart.item');
    // var cart = await Promise.all(
    //   loggedInUser.personalcart.map(async (elem) => {
    //     var book = await Book.findById(elem.item);
    //     return book;
    //   })
    // );
    var totalPrice = 0;
    loggedInUser.personalcart.forEach((elem,index)=>{
      totalPrice += elem.item.price*elem.quantity;
    });
    res.render('personalCart', {loggedInUser, totalPrice});
  }
  catch(error) {
    return next(error);
  }
  
});
/**
 * checks out user with his/her current cart
 */
router.get('/checkout', auth.isLoggedin, async(req, res, next) =>{
  var id = req.session.userId;
  try{
    var loggedInUser = await User.findById(id).populate('personalcart.item');
    // console.log(loggedInUser);
    
    var totalPrice = 0;
    //Checks if its okay to proceed with order and calculates totalPrice
    loggedInUser.personalcart.forEach((elem,index)=>{
      if(elem.item.quantity <  elem.quantity) {
        //Cant proceed with order display flash
        res.redirect('/users/cart');
      }
      else{
        totalPrice += elem.item.price*elem.quantity;
      }
    });

    //Order ready to be processed remove from inventory
    var updateBooks = await Promise.all(
      loggedInUser.personalcart.map(async (elem) => {
        var book = await Book.findByIdAndUpdate(elem.item.id, {
          $inc:{
            quantity: -elem.quantity
          }
        });
        return book;
      })
    );
    // console.log(updateBooks);
    var purchase = await Purchase.create({
      books: loggedInUser.personalcart.map(elem => {
        return {
          item: elem.item, 
          quantity: elem.quantity
        };
      }), buyer: id, totalPrice: totalPrice
    });
    var updatedUser =  await User.findByIdAndUpdate(id, {
      $set:{ 
        personalcart: []
      }
    });
    // console.log(updatedUser);
    updatedUser = await User.findByIdAndUpdate(id,  {
      $addToSet: {
        purchases: purchase.id
      }
    });
    // console.log(updatedUser);
    res.render('checkout', {loggedInUser, purchase});
  }
  catch(error) {
    return next(error);
  }

});
module.exports = router;