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
//add to cart
router.post('/:slug/add', auth.isLoggedin, async(req, res, next) =>{
    var slug = req.params.slug;
    var quantity = req.body.quantity;
    var id = req.session.userId;
    try{
        var book = await Book.findOne({slug});
        console.log(book.title, book.id);
        // var cart = await Cart.findOneAndUpdate({buyer: req.session.userId},
        //      { $pull: { books: {book: book.id }}});
        // console.log(cart.id);
        // cart = await Cart.findOneAndUpdate({buyer: req.session.userId},
        //      { $push: { books: {
        //          book: book.id,
        //          quantity: quantity
        //      }}
        //      }, {runValidators: true, new: true});
        // var user = User.findByIdAndUpdate(id, 
        //     {$pull: { personalCart: { item: book.id } } }, 
        //     {safe:true}
        // );
        console.log('PULLER');
        var user = User.findByIdAndUpdate(id, 
            {$push: {personalCart: {item: book.id, quantity:quantity}}}, 
            {runValidators:true, new:true});
        // console.log(user);
        res.redirect('/books');
        
    }
    catch(error){
        return next(error);
    }
});
//remove from cart
router.post('/:slug/remove', auth.isLoggedin, async(req, res, next) =>{
    var slug = req.params.slug;
    var quantity = req.body.quantity;
    
    try{
        var book = await Book.findOne({slug});
        console.log(book);
        console.log(req.session.userId); 
        
        var cart = await Cart.findOneAndUpdate({buyer: req.session.userId},
             { $pull: { books: {book: book.id }}});
        
        res.redirect('/books');
        
    }
    catch(error){
        return next(error);
    }
});
//add to wishlist
router.get('/:slug/wish', auth.isLoggedin, async(req, res, next) =>{
    var slug = req.params.slug;
    
    try{
        var book = await Book.findOne({slug});
        console.log(book);
        console.log(req.session.userId); 
        var user = await User.findByIdAndUpdate(req.session.userId, {$addToSet : {wishList: book.id}}, {new:true});
        res.redirect('/books');
        
    }
    catch(error){
        return next(error);
    }
});


//remove from wishlist
router.get('/:slug/discard', auth.isLoggedin, async(req, res, next) =>{
    var slug = req.params.slug;
    
    try{
        var book = await Book.findOne({slug});
        console.log(book);
        console.log(req.session.userId); 
        var user = await User.findByIdAndUpdate(req.session.userId, {$pull : {wishList: book.id}}, {new:true});
        res.redirect('/books');
        
    }
    catch(error){
        return next(error);
    }
});


module.exports = router;