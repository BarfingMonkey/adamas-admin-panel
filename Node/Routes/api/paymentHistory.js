const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

const Payment= require('../../models/Payment')

router.get('/publicsite/paymenthistory/:id', async(req,res)=>{
    const {id:userId}= req.params;
    console.log('userId: ',userId);
    const paymentHistory = await Payment.find({userId}).populate('cartItems');
    console.log('paymentHistory', paymentHistory);
    if(!paymentHistory){
        return res.json({"message":"Payment not found"})
    }
    res.json(paymentHistory)
    //res.json({"message":"Payment not found"})
})

module.exports= router; 