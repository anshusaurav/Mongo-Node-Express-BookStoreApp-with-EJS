var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var Purchase = require('../models/purchase');
var Address = require('../models/address');
var auth = require('../middlewares/auth');
var mailer = require('../utils/mailer');


router.post('/register', async(req, res, next) =>{
  // console.log('HEREEERE');
  console.log(req.body);
  let {email} = req.body;
  try{
    var user = await User.findOne({email},'-password');
    if(user){
      req.flash('error', 'Email already registered');
      // res.locals.message = req.flash();
      res.redirect('/');
    }
    if (!user) {
      user = await User.create(req.body);
      var rand = Math.floor((Math.random() * 100) + 54);
      // var vc = await VerificationCode.create({code: rand, user: user.id});
      user.activeToken = rand;
      var link = 'http://locolhost:3000/account/active/'
                           + user.activeToken;
      // console.log(user);
      // mailer.send({
      //             to: req.body.email,
      //             subject: 'Welcome',
      //             html: 'Please click <a href="' + link + '"> here </a> to activate your account.'
      // });
      // user = await User.findOneAndUpdate({email}, {$set: {activeToken: rand}});
      //flash message for confirmation mail
      console.log(user);
      req.flash('success', 'Registered successfully. Please login')
      return res.redirect('/users/login');
    }
  }
  catch(error) {
    return next(error);
  }

});

// get login

router.get("/login", (req, res) => {
  res.render("signin");
});

// verify login

router.post('/login', async(req, res, next) =>{
  let {email, password} = req.body;
  try{
    let user = await User.findOne({email}, '-password');
    if (!user) {
        req.flash('error', 'Email is not registered, please register');
        return res.redirect('users/login');
    }
    if (!user.verifyPassword(password)) {
      req.flash('error', 'Invalid password. Please try again');
      return res.redirect('users/login');
    }
    if(user.isBlocked)  {
      req.flash('error', 'User blocked. Please contact support');
      return res.redirect('users/login');
    }
    
    req.session.userId = user.id;
    req.session.user = user;
    if(user.isAdmin){
      req.flash('success', 'Welcome Admin');
      res.redirect('/admin');
    }
    else {
      req.flash('success', 'Welcome ' + user.name);
      res.redirect("/books");
    }
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
router.post('/checkout', auth.isLoggedin, async(req, res, next) =>{
  var id = req.session.userId;
  console.log(req.body);
  var addressOption = req.body.addressOption;
  
  let ref = req.get('Referrer');
  console.log('addroption: ' + addressOption);
  try{
    var loggedInUser = await User.findById(id).populate('personalcart.item');
    // console.log(loggedInUser);
    var userAddresses = await Address.find({user:id});
    console.log(userAddresses);
    var totalPrice = 0;
    let success = true;
    let strError = '';
    //Checks if its okay to proceed with order and calculates totalPrice
    loggedInUser.personalcart.forEach((elem,index)=>{
      if(elem.item.quantity <  elem.quantity) {
        success = false;
        strError = elem.item.title + elem.item.author + ' is not available';
      }
      else{
        totalPrice += elem.item.price*elem.quantity;
      }
    });
    if(success){
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
      var address = userAddresses[addressOption];
      var purchase = await Purchase.create({
        books: loggedInUser.personalcart.map(elem => {
          return {
            item: elem.item, 
            quantity: elem.quantity,
             
          };
        }), buyer: id, totalPrice: totalPrice,addressShippedTo: userAddresses[addressOption].id,
      });
      console.log(purchase);
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
    }
    if(success){
      req.flash('success', 'Order placed successfully')
      res.render('checkout', {loggedInUser, purchase, address});
    }
    else{
      req.flash('error', strError);
      res.redirect('/users/cart');
    }
  }
  catch(error) {
    return next(error);
  }

});
module.exports = router;