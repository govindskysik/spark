const express=require('express')
const router=express.Router();

const {orderHistory,placeOrder}=require("../controllers/order")

router.get('/',orderHistory);
router.post('/',placeOrder);

module.exports=router