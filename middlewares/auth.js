const User = require("../models/user");

//  handle Access
exports.isLoggedin = (req,res,next) => { 
  if (req.session && req.session.userId) {
    next()
  } else {
    res.redirect("/users/login");
  }
}

exports.loggedSession = (req,res,next)=> {
  if(req.session && req.session.userId){
      let userId = req.session.userId;
      User.findById(userId, '-password', (err, user)=> {
          if(err) return next("invalid userId in schema");
          req.user = user;
          res.locals.user = user;
          next();
      })
  } else {
      req.loggedSession = null;
      res.locals.user = null;
      next();
  }
}