var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var Cart = require('../models/cart');
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
router.post('/:slug/add', auth.isLoggedin, async(req, res, next) =>{
    var slug = req.params.slug;
    var quantity = req.body.quantity;
    
    try{
        var book = await Book.findOne({slug});
        console.log(book.id);
        var cart = await Cart.findOneAndUpdate({buyer:req.session.userId},
             { $pull: { "books.book": book.id }});

        cart = await Cart.findOneAndUpdate({buyer:req.session.userId},
             { $push:{ "books": {
                 book: book.id,
                 quantity: quantity
             }}
             });
        res.redirect('/books');
        
    }
    catch(error){
        return next(error);
    }
});

module.exports = router;