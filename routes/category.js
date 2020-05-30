var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var Review = require('../models/review');
var Category = require('../models/category');


router.get('/', (req, res, next) =>{

});


router.get('/:categoryName',  async(req, res, next) =>{
    var categoryName = req.params.categoryName;
    try{
        var category = Category.findOne({})
    }
    catch(error) {
        return next(error);
    }
})

module.exports = router;