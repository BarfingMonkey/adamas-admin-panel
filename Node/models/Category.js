const mongoose = require('mongoose')

const categorySchema= new mongoose.Schema({
    name:{
        type: String,
        required:true,
        lowercase: true,
    },
    description:{
        type: String,
        required: true,
    },
    status:{
        type: Boolean
    },
    img:{
        type: String
    }
},  {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on'}
    }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
