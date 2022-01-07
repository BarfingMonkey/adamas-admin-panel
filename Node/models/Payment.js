const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    userId:{
        type: String
    },
    paymentId:{
        type: String
    },
    amount:{
        type: String
    },
    cardNumber:{
        type: String
    },
    cartItems:[
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'CartItem'
        }
    ],
})

const Payment = mongoose.model('payment', paymentSchema)
module.exports = Payment;