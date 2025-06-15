const mongoose = require('mongoose');  


const categorySchema = new mongoose.Schema({
    name: {
        type: String,  
        required: true,
        unique: true,
    },
    thumbnail: {
       public_id: {
            type: String,
            required: [true, "Please upload a thumbnail image"],
        },
        url: {
            type: String,
            required: [true, "Please upload a thumbnail image"],
        },
    },
});

module.exports = mongoose.model('Category', categorySchema);