const express=require('express');
const router=express.Router();

const {addToCart,viewCart,removeFromCart,clearCart,updateCartItem}=require('../controllers/Cart');

router.post('/add',addToCart);
router.get('/',viewCart);
router.delete('/',removeFromCart);
router.delete('/clearCart',clearCart);
router.patch('/',updateCartItem);


module.exports=router;