var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');

router.get('/', auth.isAdminUser, (req, res, next) =>{
    res.render('admin');
});
module.exports = router;