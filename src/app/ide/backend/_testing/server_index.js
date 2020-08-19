
var express = require("express");
var app = express();
var session = require("node-session");
var bcrypt = require("bcrypt");

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(session({ secret: 'ssshhhhh' }));

var sess;

app.get("/", function (request, response) {
    response.sendFile(__dirname + "../../../../index.html");
});

app.post('/login', function(req, res) {
    sess = req.session;
    
});

app.get('/blocks', function(request, response) {
    var blocks = ['Fixed', 'Movable', 'Rotating'];
    if (request.query.limit >= 0) {
        response.json(blocks.slice(0, request.query.limit));
    }
    else {
        response.json(blocks);
    }
});

app.get('/application', function(request, response) {

});

app.listen(3000);
