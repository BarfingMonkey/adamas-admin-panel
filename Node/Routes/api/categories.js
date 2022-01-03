//Routes/api/categories

const express = require('express')
const router = express.Router()
var multer = require('multer')
const bodyParser = require('body-parser')

router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
///model
const MySchema = require('../../models/Category')
const path = require('path')

//Multer Config
//Store Image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads/')
    
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})
//receive Single file
var upload = multer({ storage: storage })
//server give Response
router.post('/upload',(req, res) => {  
    upload(req, res, 
        (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }
        return res.status(200).send(req.file)
        }
    )
});

///////////////
//Custom Routes
// @ route GET api/categories/admin/addCategory
// @ description addCategory to MongoDB
// @ public Access
//Server send data to client side on get Routes
//Read Routes
router.get('/', (req, res) => {

    MySchema.find((err ,docs)=>{
        if(!err){
            console.log(docs)
            res.end('data is find in mongo')
        }
        else{
            console.log(err)
        }
    })
  });
//Send Data to MonogoDB 
router.get('/admin/categorylist', (req, res)=>{
    //console.log('Hit the GET Router')
    MySchema.find({})
        .then(data => {
            res.json(data)
            //console.log(data)
        })
        .catch(err=>console.log(err))
});
router.delete('/admin/categorylist/:id', (req,res)=>{
    //console.log(req.params);
    const id= req.params.id;
    MySchema.findByIdAndDelete(id)
        .then(data => {
            console.log(data)
            console.log('deleted!')
        })
        .catch(err=>console.log(err))
})
router.get('/admin/updatecategory/:id', (req, res)=>{
    //console.log('update category hit')
    MySchema.findOne({"_id": req.params.id})
        .then(data => {
            res.json(data)
            console.log(data)
        })
        .catch(err=>console.log(err))
});
router.put('/admin/updatecategory/:id', upload.any(), 
    async (req,res) => {
    console.log(req.body)
    console.log(req.files)
    const id= req.body._id;

    await MySchema.findByIdAndUpdate(id, req.body)
        .then(data => {
            res.json(data)
            console.log(data)
        })
        .catch(err=>console.log(err))
    if(req.files[0].fieldname==="img"){
        await MySchema.findByIdAndUpdate(id, {img:req.files[0].filename})
            .then(data=>{
                res.json(data)
                //console.log(data)
            })
            .catch(err=>console.log(err))
    }
    return res.json({message:"yes"}) 
})
router.post('/admin/addcategory', upload.any(), 
    async (req,res) => {
    console.log(req.files)
    const newData = new MySchema();
    newData.name = req.body.name
    newData.description = req.body.description
    newData.img=req.files[0].filename
    newData.status= req.body.status
    await newData.save()
    console.log(newData)
return res.json({message:"yes"})
    }
)

module.exports = router;


    // console.log('Hit the post Router')
    // console.log(req.body)
    // console.log(req.body.name)
    // console.log(req.body.description)
    // console.log(req.files)



    // MySchema.findByIdAndUpdate(id,{ 
    //     name: req.body.name,
    //     description: req.body.description,
    //     img:req.files[0].filename,
    //     status: req.body.status
    // })