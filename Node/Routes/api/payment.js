const express = require('express')
const router= express.Router()
const bodyParser= require('body-parser')
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const stripe= require("stripe")("sk_test_51KDjaiKUwGjNfbg4AbKY8bO71UhZMTpnzvInuivbGbCCSOIc0N5Ce6OiFAlglYR4tU7ZyB8hvwwnxyLdxBp061fK00eprWF2lJ")
const mailgun = require("mailgun-js");
const DOMAIN = "sandboxa3256060d2154a22b1b7f3cc306ecd4b.mailgun.org";
const mg = mailgun({apiKey: "d2dc22a8dc2e4a55100ec47c354b36e6-0be3b63b-cace8e96", domain: DOMAIN});

const Cart = require('../../models/Cart')
const CartItem = require('../../models/CartItem')
const Payment = require('../../models/Payment')

router.post("/payment", async(req,res)=>{
    let {amount} = req.body
    const data = {
        from: "Mailgun Sandbox <postmaster@sandboxa3256060d2154a22b1b7f3cc306ecd4b.mailgun.org>",
        to: "muneebahmad.mern@gmail.com",
        subject: "Adamas Ecommerce",
        text: `Your transaction of $${amount} has been processed. Thank you for shopping at Adamas Store.
        Regards.`
    };
    try{
        // console.log('cart: ', cartItems)
        // console.log('amount type: ', typeof amount, 'amount: ', amount)
        // console.log('total type: ', typeof total, 'total: ', total)

        const intent = await stripe.paymentIntents.create({
            amount,
            currency:"USD",
            description: "Cart",
        })
        
        res.json({client_secret: intent.client_secret, intent_id:intent.id})
        // mg.messages().send(data, function (error, body) {
        //     console.log(body);
        // });
    }
    catch(error){
        console.log("Error",error)
        res.json({
            message: "Payment failed",
            success: false
        })
    }
})

router.post('/confirmpayment', async(req, res) => {

    //extract payment type from the client request
    const paymentType = String(req.body.payment_type);
  
    //handle confirmed stripe transaction
    if (paymentType == "stripe") {
        let {amount, userId} = req.body
        const cart = await Cart.findOne({userId, status:1})
        const cartItems = await CartItem.find({cartId:cart._id}).populate('productInfo')
        //logic to validate amount sent from the frontend
        let total = 0;
        for(let cartItem of cartItems){
            console.log(parseInt(cartItem.qty))
            console.log(parseInt(cartItem.productInfo.price))
            total = total + (parseInt(cartItem.qty) * parseInt(cartItem.productInfo.price))
        }
        if(amount===total){
            //get payment id for stripe
            const clientid = String(req.body.payment_id);
            //get the transaction based on the provided id
            await stripe.paymentIntents.retrieve(
                clientid,
                async function(err, paymentIntent) {
                    //handle errors
                    if (err){
                        console.log(err);
                    }
                    //respond to the client that the server confirmed the transaction
                    if (paymentIntent.status === 'succeeded') {
                        console.log("confirmed stripe payment: " + clientid);
                        await Cart.findOneAndUpdate({userId, status:1}, {status:2})
                        const payment = await Payment.create({userId ,paymentId:clientid, amount, cartItems})
                        res.json({success: true});
                    } else {
                        res.json({success: false});
                    }
                }
            );
        }
    } 
    
  })

module.exports = router;

