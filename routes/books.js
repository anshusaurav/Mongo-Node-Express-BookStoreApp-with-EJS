var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var auth = require('../middlewares/auth');

router.get('/', async(req, res, next) =>{
    try{
        var books = await Book.find();
        res.render('books',{books: books});
    }
    catch(error){
        return next(error);
    }
});


module.exports = router;