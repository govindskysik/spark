const {StatusCodes}=require('http-status-codes')
const mongoose=require('mongoose')

const Product=require('../models/product')
const User=require('../models/user')
const Order=require('../models/order')
const Cart=require('../models/cart')


const placeOrder=async(req,res)=>{
    // const session=await mongoose.startSession();
    // session.startTransaction();
    // try {
    //     const {userId}=req.user;
    //     const {address}=req.body;

        
    // } catch (error) {
        
    // }
    res.send("place")
}
const orderHistory=async(req,res)=>{
    res.send("hidtory")
}

const getOrderById=async(req,res)=>{
    res.send("get order")
}
const cancelOrder=async(req,res)=>{
    res.send("cancel order")
}
const updateOrderStatus=async(req,res)=>{
    res.send("update ")
}

module.exports={placeOrder,orderHistory}