const mongoose = require('mongoose')

const productSchema= new mongoose.Schema({    
    name:{        
        type: String,        
        //required:true,        
        lowercase: true,    
    },    
    description:{        
        type: String,        
        //required: true,    
    },
    status:{
        type: Boolean
    },
    img:{   
        type: String  
    },
    price:{
        type: String
    },
    catName:{
        type: String
    },
    catId:{ 
        type: String
    }
},  {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on'}
    }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
