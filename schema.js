const mongoose = require('mongoose');
const schema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    Mobno: {
        type: String,
    },
    oldService: {
        type: String
    }
})

module.exports = mongoose.model('cus', schema)