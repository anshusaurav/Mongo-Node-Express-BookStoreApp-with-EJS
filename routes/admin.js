var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Category = require('../models/category');
var Book = require('../models/book');
var auth = require('../middlewares/auth');

router.get('/', (req, res, next) =>{
    res.render('admin');
});
router.get('/user', async(req, res, next) =>{
    try{
        var users = await User.find({isAdmin: false},'-password');
        res.render('adminUser',{users: users});
    }
    catch(error){
        return next(error);
    }
});
router.get('/block/:id', async(req, res, next) =>{
    try{
        var id = req.params.id;
        var user = await User.findByIdAndUpdate(id, {$set:{isBlocked: true}} );
        res.redirect('/admin/user');
    }
    catch(error){
        return next(error);
    }
});

router.get('/unblock/:id', async(req, res, next) =>{
    try{
        var id = req.params.id;
        var user = await User.findByIdAndUpdate(id, {$set:{isBlocked: false}} );
        res.redirect('/admin/user');
    }
    catch(error){
        return next(error);
    }
});
router.get('/book',  async(req, res, next) =>{
    try{
        var books = await Book.find();
        res.render('adminBook',{books: books});
    }
    catch(error){
        return next(error);
    }
});
router.get('/book/add', async(req, res, next) =>{
    try{
    var categories = await Category.find({});
        
    res.render('addBook')
    }catch(error){
        return next(error);
    }
});
router.post('/book/add', async(req, res, next) =>{
    try{
        var book = await Book.create(req.body);
        res.redirect('/admin');
    }
    catch(error){
        return next(error);
    }
});
router.get('/edit/:slug', async(req, res, next) =>{
    try{
        var {slug} = req.params.slug;
        console.log(slug);
        var book = await Book.findOne(slug);
        console.log(book);
        res.render('editBook', {book: book});
    }
    catch(error){
        return next(error);
    }
});

router.post('/edit/:slug', async(req, res, next) =>{
    try{
        var {slug} = req.params.slug;
        var book = await Book.findOneAndUpdate(slug, req.body,{runValidators: true, new:true})
        res.redirect('/admin/book');
    }
    catch(error){
        return next(error);
    }
});
router.get('/delete/:slug', async(req, res, next) =>{
    try{
        
        var {slug} = req.params.slug;
        var book = await Book.findOneAndDelete(slug);
        res.redirect('/admin/book');
    }
    catch(error){
        return next(error);
    }
});
module.exports = router;