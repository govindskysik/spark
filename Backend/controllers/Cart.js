const Cart=require('../models/cart')
const Product=require('../models/product')
const {StatusCodes}=require('http-status-codes')

const addToCart=async(req,res)=>{
    try {
        const {userId}=req.user
        const {quantity,productId,size,color}=req.body;
        const product=await Product.findById(productId).select('final_price sizes colors available_for_delivery');

        if(!product || !product.available_for_delivery){
            return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"product not available"})
        }
        if(size && !product.sizes.includes(size)){
            return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"selected size not available"})
        }
        if(color && !product.colors.includes(color)){
            return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"selected color not available"})
        }
        let cart=await Cart.findOne({userId});
        const product_price=product.final_price*quantity;

        if(!cart){
            cart=await Cart.create({
                userId,
                products:[{productId,quantity,size,color}],
                total_price:product_price
            })
        }else{
            const index=cart.products.findIndex(item=>
                item.productId===productId&&
                item.size===size&&
                item.color===color
            )
            if(index>-1){
                cart.products[index].quantity+=quantity
            }else{
                cart.products.push({productId,quantity,size,color});
            }
            cart.total_price+=product_price;
            await cart.save();
        }
        return res.status(StatusCodes.OK).json({
            success:true,
            data:{
                products:cart.products,
                total_price:cart.total_price
            }})
    } catch (error) {
        console.log('error while adding to the cart ',error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:"error while adding to the cart "})
    }
}
const removeFromCart=async(req,res)=>{

}
const updateCartItem=async(req,res)=>{

}
const clearCart=async(req,res)=>{

}
const viewCart=async(req,res)=>{

}

module.exports={addToCart ,removeFromCart,updateCartItem,clearCart,viewCart};