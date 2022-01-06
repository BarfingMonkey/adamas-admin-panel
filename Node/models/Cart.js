const mongoose = require('mongoose')

const cartSchema= new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    status:{
        type: Number
    },
},  {
        timestamps: { createdAt: 'created_on', updatedAt: 'updated_on'}
    }
)

const Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;