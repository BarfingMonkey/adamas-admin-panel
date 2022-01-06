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

router.post("/payment", async(req,res)=>{
    console.log(req.body.cartId)
    let {amount, id, userId} = req.body
    const data = {
        from: "Mailgun Sandbox <postmaster@sandboxa3256060d2154a22b1b7f3cc306ecd4b.mailgun.org>",
        to: "muneebahmad.mern@gmail.com",
        subject: "Adamas Ecommerce",
        text: `Your transaction of $${amount} has been processed. Thank you for shopping at Adamas Store.
        Regards.`
    };
    try{
        const payment = await stripe.paymentIntents.create({
            amount,
            currency:"USD",
            description: "Cart",
            payment_method: id,
            confirm: true
        })
        await Cart.findOneAndUpdate({userId, status:1}, {status:2})
            .then(res=>console.log('status updated: ', res))
        console.log("Payment", payment)
        res.json({
            message: "Payment successful",
            success: true
        })
        mg.messages().send(data, function (error, body) {
            console.log(body);
        });
    }
    catch(error){
        console.log("Error",error)
        res.json({
            message: "Payment failed",
            success: false
        })
    }
})

module.exports = router;