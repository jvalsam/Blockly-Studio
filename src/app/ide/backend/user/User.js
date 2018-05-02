var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var validateName = (value) => value && value.length >= 1;
var UserSchema = new mongoose.Schema({
    session: {
        type: Object,
        accessToken: {
            type: String,
            required: [true, "session.accessToken not exist"]
        },
        required: [true, "session not exist"]
    },
    username: {
        type: String,
        required: [validateName, "username not exist"]
    },
    email: {
        type: String,
        required: [validateName, "email not exist"]
    },
    age: {
        type: Number,
        required: [true, "age not exist"]
    },
    password: {
        type: String,
        required: [true, "password not exist"]
    },
    firstname: {
        type: String,
        required: [ validateName, "firstname is not valid" ]
    },
    surname: {
        type: String,
        required: [validateName, "surnmame is not valid"]
    },
    platformInfo: {
        type: Object,
        exprerienceLevel: {
            type: String,
            required: [true, "experiencelevel not exists"]
        },
        required: [true, "platformInfo not exist"]
    }
});

// UserSchema.pre('save', function (next) {
//      var self = this;
//      console.log("called......");
//      next();
// });

UserSchema.plugin(passportLocalMongoose);  
module.exports = mongoose.model('User', UserSchema, 'Users');