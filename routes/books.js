var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var auth = require('../middlewares/auth');

router.get('/', async(req, res, next) =>{
    try{
        var books = await Book.find().populate('categories');
        books.forEach(book =>{
            var sum = 0;
            var cnt = 0;
            book.ratings.forEach(elem =>{
                sum += elem.rating;
                cnt++;
            })    
            if(cnt > 0 ) {
                book.isRated = true;
                book.averageRating = Math.round(sum/cnt);
            }
            else{
                book.isRated = false;
            }
        })
        console.log(books);
        res.render('books',{books: books});
    }
    catch(error){
        return next(error);
    }
});
router.get('/:slug', async(req, res, next) =>{
    var slug = req.params.slug;
    try{
        var book = await Book.findOne({slug}).populate('categories').populate('reviews');
        console.log(book);
        res.render('book',{book:book});
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
    let ref = req.get('Referrer');
    console.log(ref);
    try{
        var book = await Book.findOne({slug});
        // console.log(book.title, book.id);
        var quantityPresent = 0;
        var user = await User.findById(id);
        user.personalcart.forEach(elem =>{
            if(elem.item == book.id)
                quantityPresent = elem.quantity;
        })
        user = await User.findByIdAndUpdate(id, 
            {$pull: { personalcart: { item: book.id } } }, 
            {safe:true}
        );
        user = await User.findByIdAndUpdate(id, 
            {$push: {personalcart: {item: book.id, quantity:(Number(quantity) + Number(quantityPresent)) + ''} }},
            {runValidators: true, new: true});
        
        req.flash('Success', `Book ${book.title.substr(0, 10)}... Qty: ${Number(quantity) + Number(quantityPresent)} added to cart`);
        res.locals.message = req.flash();
        res.redirect(ref);
    }
    catch(error){
        return next(error);
    }
});
//remove from cart
router.get('/:slug/remove', auth.isLoggedin, async(req, res, next) =>{
    console.log('book');
    var slug = req.params.slug;
    var quantity = req.body.quantity;
    var id = req.session.userId;
    try{
        var book = await Book.findOne({slug});
        console.log(book);
        // console.log(req.session.userId); 
        
        var user = await User.findByIdAndUpdate(id, 
            {$pull: { personalcart: { item: book.id } } }
        );
        console.log(user);
        req.flash('Success', `Books ${book.title.substr(0, 10)}... removed from cart`);
        res.locals.message = req.flash();
        res.redirect('/users/cart');
    }
    catch(error){
        return next(error);
    }
});
//add to wishlist
router.get('/:slug/wish', auth.isLoggedin, async(req, res, next) =>{
    var slug = req.params.slug;
    let ref = req.get('Referrer');
    try{
        var book = await Book.findOne({slug});
        console.log(book);
        console.log(req.session.userId); 
        var user = await User.findByIdAndUpdate(req.session.userId, {$addToSet : {wishList: book.id}}, {new:true});
        res.redirect(ref);
        
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