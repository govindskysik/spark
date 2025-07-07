const express=require('express');
const router=express.Router();

const {addToCart}=require('../controllers/Cart');

router.post('/add',addToCart);

module.exports=router;