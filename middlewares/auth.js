const User = require("../models/user");

//  handle Access
exports.isLoggedin = (req,res,next) => { 
  if (req.session && req.session.userId) {
    next()
  } else {
    res.redirect("/users/login");
  }
}

exports.isAdminUser = (req,res,next) => { 
  if (req.session && req.session.userId && req.session.user.isAdmin) {
    next()
  } else {
    res.redirect("/users/login");
  }
}

exports.loggedSession = async(req,res,next)=> {
  if(req.session && req.session.userId){
      let userId = req.session.userId;
      try{
        let user = await User.findById(userId, '-password');
        req.user = user;
        res.locals.user = user;
        next();
      }
      catch(error) {
        return next('invalid userId in schema');

      }
  } else {
      req.loggedSession = null;
      res.locals.user = null;
      next();
  }
}