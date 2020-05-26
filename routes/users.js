var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');
/* GET users listing. */

//Register
router.post('/', async function(req, res, next) {
  try{
    var user = await User.create(req.body.user);
    var token  = await auth.generateJWT(user);  //.generateJWT either returns token or error
    console.log(token)
    res.status(201).json({
      email: user.email,
      username: user.username,
      token
    })
    // res.json(user);
  }
  catch(error){
    next(error);
  }
});


//login
router.post('/login', async function(req, res, next) {
  console.log(req.body);
  var {email, password}= req.body.user;
  if(!email || !password){
    return res.status(400).json({
      success: false,
      error: "email/password required"
    });
  }
  try{
    var foundUser = await User.findOne({email});
    if(!foundUser) {
      return res.status(400).json({
        success: false,
        error: "Email not registered"
      })
    }
    if(!foundUser.verifyPassword(password)) {
      return res.status(400).json({
        success: false,
        error: "Invalid password"
      })
    }
    var token  = await auth.generateJWT(foundUser);  //.generateJWT either returns token or error
    console.log(token)
    res.status(200).json({
      
      username: foundUser.username,
      token,
    })
  }
  catch(error){
    next(error);
  }

});

/**
 * Gets the currently logged-in user
 */
router.get('/', auth.verifyToken, async (req, res, next) =>{
  try {
    var user = await User.findById(req.user.userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});
/**
 * Updated user information for current user
 */
router.put('/', auth.verifyToken, async(req, res, next) =>{
  try {
    var updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      req.body.user,
      { new: true }
    );
    res.json({ updatedUser });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
