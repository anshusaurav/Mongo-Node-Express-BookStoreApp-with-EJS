var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var Purchase = require('../models/purchase');
var Review = require('../models/review');
var auth = require('../middlewares/auth');


router.get('/', async(req, res, next) =>{
    var id = req.session.userId;
    try{
        var purchases = await Purchase.find({buyer: id}).populate('books.item');
        res.render('purchases', {purchases});
    }
    catch(error){
        return next(error);
    }
});
module.exports = router;