const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const searchRouter = require('./search');
const cartRouter = require('./cart');

router.use('/user', userRouter);
router.use('/search', searchRouter);    
router.use('/cart', cartRouter);

module.exports = router;