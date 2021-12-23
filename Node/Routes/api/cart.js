const express = require('express')
const router= express.Router()
const bodyParser= require('body-parser')
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const Cart= require('../../models/Cart')
const CartItem= require('../../models/CartItem')

router.get('/publicsite/cart/:id', async(req,res)=>{
    const {id}= req.params;
    const cart = await Cart.findOne({userId:id})
    if(!cart){
        res.json({"message": "Cart not found"})
    }
    else{
        const data= CartItem.find({cartId:cart._id})
            .then(data=>{
                res.json(data)
            })
            .catch(error=>console.log(error))
        console.log(`cart items:${data}`)
    }
})

router.post('/publicsite/cart/:id', async(req,res)=>{
    const {id:userId}= req.params;
    const {productId, qty}= req.body;
    let cart = await Cart.findOne({userId})
    if(!cart){
        cart = await Cart.create({userId})
    }
    let cartItem= await CartItem.findOne({cartId:cart._id,productId})
    if(cartItem){
        res.json({message : "Product is already in Cart"})
    }
    else{
        cartItem= await CartItem.create({cartId:cart._id,productId,qty})
            .then(data=>{
                res.json({message : "Item successfully added to cart"})
            })
            .catch(error=>console.log(error))
    }
})
router.delete('/publicsite/cart/:cartItemId', async(req,res)=>{
    const id = req.params.cartItemId;
    CartItem.findByIdAndDelete(id)
        .then(data=>{
            console.log(data)
            console.log('Deleted!')
            res.json(data)
        })
        .catch(err=>res.json(err))
})

router.put('/publicsite/cart/:cartItemId', async(req,res)=>{
    const id = req.params.cartItemId;
    console.log(req.body)
    const {qty}= req.body;
    console.log(typeof qty, qty)
    CartItem.findByIdAndUpdate(id, {qty})
        .then(data=>{
            //console.log(data)
            console.log('Updated!')
            res.json(data)
        })
        .catch(err=>res.json(err))
})

module.exports = router;