const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cartId:{
        type: String,
        required: true
    },
    productId:{
        type: String,
        required: true
    },
    qty:{
        type: String,
        required: true
    }
});

const CartItem = mongoose.model('cartItem', cartItemSchema);
module.exports = CartItem;