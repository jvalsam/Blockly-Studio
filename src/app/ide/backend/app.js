var express = require('express'),
passport = require("passport"),
session = require('express-session');
var app = express();
var db = require('./managementDB');
var authentication = require('./authentication/CheckAuthentication');

app.use(passport.initialize());
app.use(passport.session());
app.use(session({
        secret: "Hello World, this is a session",
        resave: false,
        saveUninitialized: false
}));


var ApplicationController = require('./applications/ApplicationController');
app.use('/applications', authentication.check, ApplicationController);

var AuthController = require('./authentication/AuthController');
app.use('/auth', AuthController);

var DomainController = require('./domains/DomainController');
app.use('/domains', authentication.check, DomainController);

var UserController = require('./user/UserController');
app.use('/users', authentication.check, UserController);


module.exports = app;