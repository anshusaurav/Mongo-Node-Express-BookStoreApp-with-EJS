var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Category = require('../models/category');
var Book = require('../models/book');
var Address = require('../models/address');

router.get('/', async(req, res, next) =>{
    var id = req.session.userId;
    try{
        var addresses = await Address.find({user: id});
        
        console.log('Please');
        res.render('addresses', {addresses});
    } catch(error) {
        return next(error);
    }
});
router.get('/add', (req, res, next) =>{
    console.log('new address');
    res.render('newAddress');
});
router.post('/add', async(req, res, next) =>{
    var id = req.session.userId;
    req.body.user = id;
    try{
        var address = await Address.create(req.body);
        var user = await User.findByIdAndUpdate(id, {$addToSet: {addresses: address.id}});
        console.log(address, user);
        res.redirect('/addresses');
    }catch(error){

    }
});
router.get('/:id/edit', async(req, res, next) =>{
    var id = req.session.userId;
    var addrId = req.params.id;

    try{
        var address = await Address.findById(addrId);
        res.render('updateAddress', {address});
    }catch(error){

    }
});

router.post('/:id/edit', async(req, res, next) =>{
    var id = req.session.userId;
    req.body.user = id;
    var addrId = req.params.id;
    try{
        // console.log(req.body)
        var address = await Address.findByIdAndUpdate(addrId,req.body);
        res.redirect('/addresses');
    }catch(error){

    }
});

router.get('/:id/delete', async(req, res, next) =>{
    var id = req.session.userId;
    var addrId = req.params.id;
    try{
        var address = await Address.findByIdAndDelete(addrId);
        var user = await User.findByIdAndUpdate(id, {$pull: {addresses: address.id}});
        res.redirect('/addresses');
    }catch(error){

    }
});
router.get('/:id/makedefault', async(req, res, next) =>{
    var id = req.session.userId;
    var addrId = req.params.id;
    try{
        var user = await User.findByIdAndUpdate(id, {$set:{hasDefaultAddress: true, defaultAddress: addrId}})
        res.redirect('/addresses');
    }catch(error){

    }
});
module.exports = router;