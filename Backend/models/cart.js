const mongoose=require('mongoose');

const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },
    products:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true,

        },
        quantity:{
            type:Number,
            default:1,
            min:1,
        }
    }],
    total_price:{
        type:Number,
        default:0.0
    }
},{timestamps:true});

module.exports=mongoose.model('Cart',cartSchema);