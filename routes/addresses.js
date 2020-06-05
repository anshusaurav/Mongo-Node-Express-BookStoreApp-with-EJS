var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Address = require('../models/address');

router.get('/', async(req, res, next) =>{
    var id = req.session.userId;
    try{
        var addresses = await Address.find({user: id});
        res.render('addresses', {addresses});
    } catch(error) {
        return next(error);
    }
});
router.get('/add', (req, res, next) =>{
    res.render('newAddress');
});
router.post('/add', async(req, res, next) =>{
    var id = req.session.userId;
    req.body.user = id;
    try{
        var address = await Address.create(req.body);
        var user = await User.findByIdAndUpdate(id, {
            $addToSet: {
                addresses: address.id
            }
        });
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
router.get('/onthego', (req, res, next) =>{
    res.render('onthego');
});
router.post('/onthego', async(req, res, next) =>{
    var id = req.session.userId;
    req.body.user = id;
    try{
        var address = await Address.create(req.body);
        var user = await User.findByIdAndUpdate(id, {
            $addToSet: {
                addresses: address.id
            }
        });
        res.redirect('/addresses/cartaddress');
    }catch(error){

    }
});
router.post('/:id/edit', async(req, res, next) =>{
    var id = req.session.userId;
    req.body.user = id;
    var addrId = req.params.id;
    try{
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
        var user = await User.findByIdAndUpdate(id, {
            $pull: {
                addresses: addrId
            }
        });
        if(user.hasDefaultAddress && addrId == user.defaultAddress) {
            user = await User.findByIdAndUpdate(id,{
                $set: {
                    hasDefaultAddress: false
                }
            });
            user = await User.findByIdAndUpdate(id,{
                $unset:{defaultAddress: 1
                }
            });
        }
        res.redirect('/addresses');
    }catch(error){

    }
});
router.get('/:id/makedefault', async(req, res, next) =>{
    var id = req.session.userId;
    var addrId = req.params.id;
    try{
        var user = await User.findByIdAndUpdate(id, {
            $set: {
                hasDefaultAddress: true, 
                defaultAddress: addrId
            }
        });
        res.redirect('/addresses');
    }catch(error){

    }
});
router.get('/cartaddress', async(req, res, next) =>{
    var id = req.session.userId;
    try{
        var addresses = await Address.find({user: id});
        
        res.render('cartAddress', {addresses});
    } catch(error) {
        return next(error);
    }
})


router.post('/cartaddress', async(req, res, next) =>{
    //checkout here
    var id = req.session.userId;
    try{
        var addresses = await Address.find({user: id});
        var user = await User.findById(id).populate('personalCart.item');
        var totalPrice = 0;
        user.personalcart.forEach((elem,index)=>{    
              totalPrice += elem.item.price*elem.quantity;
        });
        res.render('cartAddress', {addresses, totalPrice});
    } catch(error) {
        return next(error);
    }
})
module.exports = router;