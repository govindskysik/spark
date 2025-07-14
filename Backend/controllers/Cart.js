const Cart=require('../models/cart')
const product = require('../models/product')
const Product=require('../models/product')
const {StatusCodes}=require('http-status-codes')
const mongoose=require('mongoose')

async function processProducts(cart, session) {
  let products = [];
  for (const pro of cart.products) {
    const embeddings = await Product.findById(pro.productId)
      .select('embedding embedding_text')
      .session(session);
    products.push({
      pro,
      embedding: embeddings ? embeddings.embedding : null,
      embedding_text: embeddings ? embeddings.embedding_text : null,
    });
  }
  return products;
}

const addToCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.user;
    console.log("User ID:", userId);
    const { quantity, productId, size, color } = req.body;
    console.log("User ID:", userId);
    const product = await Product.findById(productId)
      .select('final_price sizes colors available_for_delivery quantity')
      .session(session);

    if (!product  || quantity > product.quantity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "product is out of stock"
      });
    }
    if( !product.available_for_delivery){
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "product not available for delivery"
      });
    }
    if ((size && !product.sizes.includes(size)) ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "size not available"
      });
    }
    if((color && !product.colors.includes(color))){
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "color not available"
      });
    }

    let cart = await Cart.findOne({ userId }).session(session);
    const product_price = product.final_price * quantity;

    if (!cart) {
      cart = await Cart.create([{
        userId,
        products: [{ productId, quantity, size, color }],
        total_price: product_price
      }], { session });
      cart = cart[0];
    } else {
      const index = cart.products.findIndex(item =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
      );
      if (index > -1) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity, size, color });
      }
      cart.total_price += product_price;
      await cart.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return res.status(StatusCodes.OK).json({
      success: true,
      message:"product found and added to cart",
      data: {
        products: cart.products,
        total_price: cart.total_price
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log('error while adding to the cart ', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "some technical difficulties while adding to the cart. Try again later "
    });
  }
};

const removeFromCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.user;
    const { productId, size, color } = req.body;

    const cart = await Cart.findOne({ userId }).session(session);
    if (!cart) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "cart not found" });
    }

    const index = cart.products.findIndex(item =>
      item.productId === productId &&
      (!size || item.size === size) &&
      (!color || item.color === color)
    );

    if (index === -1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Product not found in cart" });
    }

    const product = await Product.findById(productId).select('final_price').session(session);

    if (cart.products[index].quantity > 1) {
      cart.products[index].quantity -= 1;
      cart.total_price = Math.max(0, cart.total_price - (product ? product.final_price : 0));
    } else {
      cart.total_price = Math.max(0, cart.total_price - (product ? product.final_price : 0));
      cart.products.splice(index, 1);
    }

    await cart.save({ session });

    
    const productsWithEmbedding=await processProducts(cart,session)
    await session.commitTransaction();
    session.endSession();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Product removed from cart",
      data: {
        products: productsWithEmbedding,
        total_price: cart.total_price
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error while removing from cart", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "some technical difficulties while removing from the cart. Try again later"
    });
  }
};

const updateCartItem = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.user;
    const { productId, size, color } = req.body;

    const cart = await Cart.findOne({ userId }).session(session);
    if (!cart) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Cart not found"
      });
    }

    const index = cart.products.findIndex(item =>
      item.productId === productId &&
      (!size || item.size === size) &&
      (!color || item.color === color)
    );
    if (index === -1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    const product = await Product.findById(productId)
      .select('final_price quantity sizes colors')
      .session(session);

    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Product does not exist"
      });
    }

    if (size && !product.sizes.includes(size)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Selected size not available"
      });
    }
    if (color && !product.colors.includes(color)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Selected color not available"
      });
    }

    if (cart.products[index].quantity + 1 > product.quantity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `maximum available quantity is ${product.quantity}`,
        
      });
    }

    cart.products[index].quantity += 1;
    cart.total_price += product.final_price;

    await cart.save({ session });
        const productsWithEmbedding=await processProducts(cart,session)

    await session.commitTransaction();
    session.endSession();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Cart item quantity incremented by one",
      data: {
        products: productsWithEmbedding,
        total_price: cart.total_price
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Technical difficulties while updating cart item"
    });
  }
};

const clearCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.user;
    const cart = await Cart.findOne({ userId }).session(session);

    if (!cart) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Cart not found"
      });
    }

    let message;
    if (cart.products.length === 0) {
      message = "Cart is already empty";
    } else {
      cart.products = [];
      cart.total_price = 0;
      await cart.save({ session });
      message = "Cart cleared successfully";
    }

    await session.commitTransaction();
    session.endSession();
    return res.status(StatusCodes.OK).json({
      success: true,
      message,
      data: {
        products: cart.products,
        total_price: cart.total_price || 0
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Unable to empty the cart", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Technical difficulties ,unable to empty the cart"
    });
  }
};

const viewCart=async(req,res)=>{
    try {
        const {userId}=req.user;
        const cart=await Cart.findOne({userId})
        if(!cart){
            return res.status(StatusCodes.NOT_FOUND).json({success:false,message:"cart not found"}) 
        }

        if(cart.products.length===0){
            return res.status(StatusCodes.OK).json({
                success:true,
                message:"Cart is empty",
                data:{
                    products:[],
                    total_price:cart.total_price||0
                }
            })
        }
      
        const productsWithEmbedding=await processProducts(cart)
        return res.status(StatusCodes.OK).json({
            success:true,
            data:{
                products:productsWithEmbedding,
                total_price:cart.total_price
            }
        })
    } catch (error) {
        console.log(`error while fetching cart items`,error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:"Technical difficulties while fetching cart items"})
    }
}

module.exports={addToCart ,removeFromCart,updateCartItem,clearCart,viewCart};