var mongoose = require('mongoose');

var SmartObjectSchema = new mongoose.Schema({
    uri: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    environment: {
        type: String,
        required: true
    },
    selected_functionality: {
        type: Object,
        required: true
    },
    user: {
        type: String,
        required: true
    },    
    image: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('SmartObject', SmartObjectSchema, 'SmartObjects');