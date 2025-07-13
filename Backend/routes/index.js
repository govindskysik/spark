const express = require('express');
const router = express.Router();

// const userRouter = require('./user');
const searchRouter = require('./search');
const cartRouter = require('./cart');

const auth=require('../middleware/auth')

// router.use('/user', userRouter);
router.use('/search', searchRouter);    
router.use('/cart',auth,cartRouter);

module.exports = router;