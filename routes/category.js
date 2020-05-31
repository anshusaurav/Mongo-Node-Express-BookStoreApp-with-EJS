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
        books.forEach(book =>{
            var sum = 0;
            var cnt = 0;
            book.ratings.forEach(elem =>{
                sum += elem.rating;
                cnt++;
            })    
            if(cnt > 0 ) {
                book.isRated = true;
                book.averateRating = Math.round(sum/cnt);
            }
            else{
                book.isRated = false;
            }
        })
        res.render('books', {books});
    }
    catch(error) {
        return next(error);
    }
})

module.exports = router;