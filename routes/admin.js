var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var auth = require('../middlewares/auth');

router.get('/', (req, res, next) =>{
    res.render('admin');
});
router.get('/book',  (req, res, next) =>{

});
router.get('/book/add', (req, res, next) =>{
    res.render('addBook')
})
router.post('/book/add', async(req, res, next) =>{
    try{
        var book = await Book.create(req.body);
        res.redirect('/admin');
    }
    catch(error){
        return next(error);
    }
})
module.exports = router;