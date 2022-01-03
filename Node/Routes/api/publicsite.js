const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const {requireAuth}= require('../../middleware/authMiddleware')

router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded///model
const Categories = require('../../models/Category')
const Products = require('../../models/Product')

router.get('/publicsite/categories', (req,res)=>{
    Categories.find({})
        .then(data=>{
            res.json(data)
            //console.log(data)
        })
        .catch(err=>console.log(err))
});
router.get('/publicsite/categories/products', async(req,res)=>{
    //console.log(`query: ${req.query.id}`)
    const PRODUCT_PER_PAGE = 12;
    let id= req.query.id;
    let page = parseInt(req.query.page || "0");
    let query = {};
    
    if(id && typeof id!=='undefined') {
        
        query = {"catId": id}
    }
    
    let total = await Products.countDocuments(query)
    console.log(`total ${total}`)
    console.log(`page ${page}`)
    Products.find(query).limit(PRODUCT_PER_PAGE).skip(PRODUCT_PER_PAGE*page)
        .then(data=>{
            res.json({
                totalPage: Math.ceil(total/PRODUCT_PER_PAGE),
                auth: true,
                data
            })
            //console.log(data)
        })
        .catch(err=>console.log(err))
});

router.get('/product/:id', (req,res)=>{
    const {id}= req.params;
    Products.findById(id)
        .then(data=>{
            res.json(data)
            //console.log(data)
        })
        .catch(err=>console.log(err))
});

router.get('/publicsite/products', (req,res)=>{
    Products.find({})
        .then(data=>{
            res.json(data)
            //console.log(data)
        })
        .catch(err=>console.log(err))
});

module.exports = router;