var express = require('express');
var router = express.Router();
var Book = require('../models/book');

router.post('/', async(req, res, next) =>{
    var query = req.body.searchQuery;
    console.log(query);
    
    // Book.createIndexes({title: 1, author: 1}, {unique: true});
    // Book.createIndexes({ title: 'text', author: 'text'});
    Book.find(
        { $text : { $search : query } }, 
        { score : { $meta: "textScore" } }
    )
    .sort({ score : { $meta : 'textScore' } })
    .exec(function(err, books) {
        console.log(books);
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
        res.render('searchResults',{books, query});
    });
        
    
});

module.exports = router;