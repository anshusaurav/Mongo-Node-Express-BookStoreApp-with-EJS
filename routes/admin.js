var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Category = require('../models/category');
var Book = require('../models/book');

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
        req.flash('success', 'User ' + user.name + ' is blocked successfully');
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
        req.flash('success', 'User ' + user.name + ' is unblocked successfully');
        res.redirect('/admin/user');
    }
    catch(error){
        return next(error);
    }
});
router.get('/book',  async(req, res, next) =>{
    try{
        var books = await Book.find().populate('categories');
        res.render('adminBook',{books: books});
    }
    catch(error){
        return next(error);
    }
});
router.get('/book/add', async(req, res, next) =>{
    try{
    var allCategories = await Category.find({});
   
    res.render('addBook',{allCategories})
    }catch(error){
        return next(error);
    }
});
router.post('/book/add', async(req, res, next) =>{
    try{
        // console.log('HERe');
        var allCatStr = req.body.categories.split('|');    
        // console.log(req.body.categories);
        req.body.categories = await Promise.all(
          allCatStr.map(async (elem) => {
            var category = await Category.findOne({
                categoryName: elem
            });
            return category.id;
          })
        );
        // console.log(req.body.categories);
        var book = await Book.create(req.body);
        // console.log(allCatStr);
        var updatedCategories = await Promise.all(
            allCatStr.map(async (elem) => {
                var category = await Category.findOneAndUpdate({
                        categoryName: elem
                    }, {
                        $addToSet: {
                            books: book.id
                        }
                    });
                return category.id;
            })
          );
        req.flash('success', 'Book ' + book.title + ' is added successfully');
        res.redirect('/admin/book');
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
        // console.log(book);
        res.render('editBook', {book: book});
    }
    catch(error){
        return next(error);
    }
});

router.post('/edit/:slug', async(req, res, next) =>{
    try{
        var {slug} = req.params.slug;
        var book = await Book.findOneAndUpdate(slug, req.body,{ 
            runValidators: true, 
            new:true 
        });
        req.flash('success', 'Book ' + book.title + ' is edited successfully');
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
        req.flash('success', 'Book ' + book.title + ' is deleted successfully');
        res.redirect('/admin/book');
    }
    catch(error){
        return next(error);
    }
});


router.get('/category/add', async(req, res, next) =>{
    res.render('addCategory');
});
router.post('/category/add', async(req, res, next) =>{
    try{
        var category = await Category.create(req.body);
        req.flash('success', 'Category ' + category.categoryName + ' is added successfully');
        res.redirect('/admin');
    }
    catch(error){
        return next(error);
    }
});
module.exports = router;