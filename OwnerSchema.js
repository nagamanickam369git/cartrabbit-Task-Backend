const mongoose = require('mongoose');
const schema = mongoose.Schema({
    email: {
        type: String,
        required: true,        
    },
    Mobno: {
        type: String,           
    },
})

module.exports = mongoose.model('owner', schema)