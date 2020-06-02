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
    // console.log('purchases');
    try{
        var purchases = await Purchase.find({buyer: id}).populate('books.item').sort({createdAt: -1});
        // console.log(purchases);
        purchases.forEach(purchase =>{
            purchase.books.forEach(book =>{
                var sum = 0;
                var cnt = 0;
                book.item.ratings.forEach(elem =>{
                    sum += elem.rating;
                    cnt++;
                })    
                if(cnt > 0 ) {
                    book.item.isRated = true;
                    book.item.averageRating = Math.round(sum/cnt);
                }
                else{
                    book.isRated = false;
                }
            });
        })
        // console.log(purchases);
        res.render('purchases', {purchases});
    }
    catch(error){
        return next(error);
    }
});
module.exports = router;