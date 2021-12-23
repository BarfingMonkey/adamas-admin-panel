var express = require('express');
var app = express();
var multer = require('multer');
var upload = multer();
const cookieParser= require('cookie-parser')

var cors = require('cors'); //Connect Front end routes with Backend
const connectDB = require('./config/db'); //DB Connection 
//Connect Database
connectDB();
//routes
const categories = require('./Routes/api/categories')
const products = require('./Routes/api/products')
const publicsite = require('./Routes/api/publicsite')
const authentication = require('./Routes/api/authentication')
const cart = require('./Routes/api/cart')
//cors
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials:true,
  exposedHeaders: ["set-cookie"]
  }));
  app.options('*', cors());
//Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cookieParser());
//for parsing formdata
app.use(upload.array());
// use Routes
app.use('/api', categories)
app.use('/api', products)
app.use('/api', publicsite)
app.use('/api', authentication)
app.use('/api', cart)
app.use(express.static('uploads'))
app.listen(8000, function() {
  console.log('App running on port 8000');
});
