const express = require('express');
const router = express.Router();

const orderRouter = require('./order');
const searchRouter = require('./search');
const cartRouter = require('./cart');

const auth=require('../middleware/auth')

router.use('/order', orderRouter);
router.use('/search', searchRouter);    
router.use('/cart',auth,cartRouter);

module.exports = router;