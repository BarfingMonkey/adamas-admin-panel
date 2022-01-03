const express = require('express')
const router= express.Router()
const bodyParser= require('body-parser')
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const Cart= require('../../models/Cart')
const CartItem= require('../../models/CartItem')
const Product = require('../../models/Product')

router.get('/publicsite/cart/:id', async(req,res)=>{
    const {id:userId}= req.params;
    console.log('userId',userId)
    const cart = await Cart.findOne({userId})
    console.log('cart',cart)
    if(!cart){
        res.json({"message": "Cart not found"})
    }
    else{
        await CartItem.find({cartId:cart._id}).populate("productInfo")
            .then((data)=>{
                console.log(data)
                res.json(data)
            })
            .catch(error=>{
                console.log(error)
                res.json({message : "CartItem error"})
            })
    }
})

router.post('/publicsite/cart/:id', async(req,res)=>{
    const {id:userId}= req.params;
    console.log(req.body)
    const {productId, qty}= req.body;
    let cart = await Cart.findOne({userId})
    let product = await Product.findOne({_id:productId})
    if(!cart){
        cart = await Cart.create({userId})
    }
    let cartItem= await CartItem.findOne({productInfo: productId})
    console.log('cartItem: ',cartItem)
    console.log('productID ',productId)
    if(cartItem){
        console.log("message : Product is already in Cart")
        res.json({message : "Product is already in Cart"})
    }
    else{
        cartItem = await CartItem.create({cartId : cart._id, productInfo : product ,qty})
            .then(data=>{
                res.json({message : "Item successfully added to cart"})
                console.log(data)
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
    console.log('req.body',req.body)
    const {qty}= req.body;
    const updatedCart= await CartItem.findByIdAndUpdate(id, {qty})
    if(!updatedCart){
        res.json({message : "Error while updating"})
    }
    else{
        // await CartItem.find({cartId:updatedCart.cartId})
        // .then(data=>{
        //     //console.log(data)
        //     console.log('Updated!')
        //     res.json(data)
        // })
        // .catch(err=>res.json(err))
        res.json({message: "Updated!"})
    }
    
})

module.exports = router;