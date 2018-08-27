var mongoose = require('mongoose');
var User = require('../user/User');

var SmartObjectSchema = new mongoose.Schema({
    name: {
        type: String
    },
    environment: {
        type: String
    },
    object: {
        type: Object,
        required: true
    },
    user: {
        type: String
    },    
    image: {
        type: String
    }
});


module.exports = mongoose.model('SmartObject', SmartObjectSchema, 'SmartObjects');