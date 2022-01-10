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
    cartItems:[
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'cartItem'
        }
    ],
},  {
        timestamps: { createdAt: 'created_on', updatedAt: 'updated_on'}
    }
)

const Payment = mongoose.model('payment', paymentSchema)
module.exports = Payment;