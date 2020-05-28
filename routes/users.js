var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var Purchase = require('../models/purchase');
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
    var cart = await Promise.all(
      loggedInUser.personalcart.map(async (elem) => {
        var book = await Book.findById(elem.item);
        return book;
      })
    );
    var totalPrice = 0;
    loggedInUser.personalcart.forEach((elem,index)=>{
      loggedInUser.personalcart[index].item = cart[index];
      totalPrice += loggedInUser.personalcart[index].item.price*loggedInUser.personalcart[index].quantity;
    });
    res.render('personalCart', {loggedInUser:loggedInUser, totalPrice: totalPrice});
  }
  catch(error) {
    return next(error);
  }
  
});
 /**
  * books: [{
        book:{
            type: Schema.Types.ObjectId,
            ref:"Book",
            required: true
        },
        quantity:{
            type: Number,
            required: true
        }
    }],
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    totalPrice:{
        type: Number,
        required: true,
        default: 0
    },
    addressShippedTo:{
        type: Schema.Types.ObjectId,
        ref: "Address"
    }
  */
router.get('/checkout', auth.isLoggedin, async(req, res, next) =>{
  var id = req.session.userId;
  console.log(id);
  try{
    var loggedInUser = await User.findById(id).populate('personalcart');
    console.log(loggedInUser);
    
    // var purchaseToBeAdded =  new Purchase();
    // purchaseToBeAdded.books = loggedInUser.personalcart.map(elem =>{
    //   return {item: elem.item, quantity: elem.quantity};
    // });
    // purchaseToBeAdded.buyer = id;
    var cart = await Promise.all(
      loggedInUser.personalcart.map(async (elem) => {
        var book = await Book.findById(elem.item);
        return book;
      })
    );
    var totalPrice = 0;
    loggedInUser.personalcart.forEach((elem,index)=>{
      loggedInUser.personalcart[index].item = cart[index];
      totalPrice += loggedInUser.personalcart[index].item.price*loggedInUser.personalcart[index].quantity;
    });
    
    // purchaseToBeAdded.totalPrice = totalPrice
    // console.log(purchaseToBeAdded);
    var purchase = await Purchase.create({books: loggedInUser.personalcart.map(elem =>{
      return {item: elem.item, quantity: elem.quantity};
    }), buyer: id, totalPrice: totalPrice});
    // var updatedUser = await User.findByIdAndUpdate(id, { $set: { personalcart: [] }});
    // console.log('Purchased');
    console.log(purchase);
    res.render('checkout', {loggedInUser, purchase});
  }
  catch(error) {
    return next(error);
  }

});
module.exports = router;