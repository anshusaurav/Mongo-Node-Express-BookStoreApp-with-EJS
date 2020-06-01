var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Category = require('../models/category');
var Book = require('../models/book');
var Address = require('../models/address');

router.get('/', async(req, res, next) =>{
    var id = req.session.userId;
    try{
        var addresses = Address.find({user: id});
        res.render('addresses', {addresses});
    } catch(error) {
        return next(error);
    }
});

module.exports = router;