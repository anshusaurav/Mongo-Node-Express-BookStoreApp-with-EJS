var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var Purchase = require('../models/purchase');
var Review = require('../models/review');
var auth = require('../middlewares/auth');

router.get('/', (req, res, next) =>{
    res.render('review');
})
router.get('/pending', async(req, res, next) =>{
    var id = req.session.userId;
    var setBook = new Set();
    //get list of books purchased by user
    var purchasesDone = await Purchase.find({buyer: id});
    console.log(purchasesDone);
    purchasesDone.forEach(purchase =>{
        purchase.books.forEach(book =>{
            setBook.add(''+book.item);
        })
        
    });
    
    console.log(setBook);
    //get all review posted by user
    var booksReviewPosted = [];
    var booksReviewPending = [];
    var arrSetBook = Array.from(setBook);
    var reviewsPosted = await Review.find({buyer: id});
    console.log(reviewsPosted.length);
    //get two arrays one for books whose review is posted one for whose not
    reviewsPosted.forEach(review =>{
        booksReviewPosted.push(''+review.book);
    });
    arrSetBook.forEach(book =>{
        if(!booksReviewPosted.includes(''+book))
            booksReviewPending.push(''+book);
    })
    console.log("Posted", booksReviewPosted);
    console.log("Pending", booksReviewPending);
    
    
    //show all books whose reviews are pending
    var arrBooks = await Promise.all(
        booksReviewPending.map(async (elem) => {
          var book = await Book.findById(elem)
          return book;
        })
      );
    console.log(arrBooks);
    res.render('pendingReviews',{arrBooks});
});

router.get('/posted', async(req, res, next) =>{
    var id = req.session.userId;
    var setBook = new Set();
    //get list of books purchased by user
    var purchasesDone = await Purchase.find({buyer: id});
    console.log(purchasesDone);
    purchasesDone.forEach(purchase =>{
        purchase.books.forEach(book =>{
            setBook.add(''+book.item);
        })
        
    });
    
    console.log(setBook);
    //get all review posted by user
    var booksReviewPosted = [];
    var booksReviewPending = [];
    var arrSetBook = Array.from(setBook);
    var reviewsPosted = await Review.find({buyer: id});
    console.log(reviewsPosted.length);
    //get two arrays one for books whose review is posted one for whose not
    reviewsPosted.forEach(review =>{
        booksReviewPosted.push(''+review.book);
    });
    arrSetBook.forEach(book =>{
        if(!booksReviewPosted.includes(''+book))
            booksReviewPending.push(''+book);
    })
    console.log("Posted", booksReviewPosted);
    console.log("Pending", booksReviewPending);
    
    
    //show all books whose reviews are pending
    var arrBooks = await Promise.all(
        booksReviewPosted.map(async (elem) => {
          var book = await Book.findById(elem)
          return book;
        })
      );
    var reviews = await Promise.all(
        arrBooks.map(async (elem) =>{
            var review = await Review.findOne({buyer: id, book: elem.id})
            return review;
        })
    )
    console.log(arrBooks);
    var ratings = arrBooks.map(book =>{
        var rate;
        book.ratings.forEach(rating =>{
            if(rating.buyer == id)
                rate = rating.rating;
        })
        return rate;
    });
    arrBooks.forEach(book =>{
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
    console.log(ratings);
    res.render('postedReviews',{arrBooks, reviews, ratings });
});

router.get('/:slug', async(req, res, next) =>{
    var slug = req.params.slug;
    var id = req.session.userId;
    try{
        var book = await Book.findOne({slug});
        res.render('addReview', {book}); 
    }
    catch(error){
        return next(error);
    }
});

router.post('/:slug', async(req, res, next) =>{
    console.log('HERE WEGO');
    var id = req.session.userId;
    var slug = req.params.slug;
    var rating = req.body.rate;
    try{
        var book = await Book.findOne({slug});
        req.body.book = book.id;
        req.body.buyer = id;
        console.log(rating);
        var review = await Review.create(req.body);
        book = await Book.findOneAndUpdate({slug}, {$addToSet: {reviews: review.id}});
        book = await Book.findOneAndUpdate({slug}, {$addToSet: {ratings:{buyer: id, rating: rating}}});
        res.redirect('/review');
    }
    catch(error){
        return next(error);
    }
});
router.get('/:slug/delete', async(req, res, next) =>{
    console.log('HERE WEGO');
    var id = req.session.userId;
    var slug = req.params.slug;
    try{
        var book = await Book.findOne({slug}); 
        var review = await Review.findOneAndRemove({book: book.id, buyer: id});
        book = await Book.findOneAndUpdate({slug}, {$pull:{reviews: review.id}});
        book = await Book.findOneAndUpdate({slug}, {$pull:{ratings: {buyer:id}}});
        
        res.redirect('/review');
    }
    catch(error){
        return next(error);
    }
});
module.exports = router;