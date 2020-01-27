//var data = require("../shared/data");

//data.RunPlatformData.initialize("debug");
var mongoose = require('mongoose');
mongoose.connect(
    // data.RunPlatformData.MONGO_URL
    // "mongodb://puppy1:puppy1234@147.52.17.129:3032/Puppy"
    "mongodb://localhost:27017/Puppy"
);
