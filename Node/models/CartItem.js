const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cartId:{
        type: String,
        required: true
    },
    productInfo:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Product'
    },
    qty:{
        type: String,
        required: true
    }
});

const CartItem = mongoose.model('cartItem', cartItemSchema);
module.exports = CartItem;