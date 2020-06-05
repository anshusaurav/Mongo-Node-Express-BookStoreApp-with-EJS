var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) =>{
  // console.log(req.catForHeader);
  res.redirect('/books');
});
router.get('/home', auth.isLoggedin, (req, res, next) =>{
  res.render('home');
});

//route for generating order_id
router.post('/order', auth.isLoggedin, async (req, res, next) => {

  const order = await rzr.orders.create({
      amount: req.body.amount * 100,
      currency: "INR"
  });
  res.send(order.id);
})

//route for saving the data after successfull payment
router.post('/success', async (req, res,next) => {
  console.log(JSON.stringify(req.body), () => { });
  res.redirect('/users/checkout')
})

module.exports = router;
