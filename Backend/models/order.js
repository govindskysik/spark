const mongoose=require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: Number,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: Number,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        size: {
            type: String
        },
        color: {
            type: String
        }
    }],
    total_price: {
        type: Number,
        required: true
    },
    shipping_address: {
        type: String,
        required: true
    },
    payment_status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    order_status: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled'],
        default: 'processing'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
