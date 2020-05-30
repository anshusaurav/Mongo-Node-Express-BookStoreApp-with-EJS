var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var Review = require('../models/review');
var Category = require('../models/category');


router.get('/', (req, res, next) =>{

});


router.get('/:slug',  async(req, res, next) =>{
    var slug = req.params.slug;
    try{
        var category = await Category.findOne({slug}).populate('books');
        var books = category.books;
        res.render('books', {books});
    }
    catch(error) {
        return next(error);
    }
})

module.exports = router;