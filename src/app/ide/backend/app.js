var express = require('express'),
passport = require("passport"),
session = require('express-session');
var app = express();
var db = require('./managementDB');
var bodyParser = require("body-parser");
var authentication = require('./authentication/CheckAuthentication');

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(session({
        secret: "Hello World, this is a session",
        resave: false,
        saveUninitialized: false
}));
var allowCrossDomain = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
};
app.use(allowCrossDomain);

app.use('/smart-object-images', express.static(__dirname + '/smart-object-images'));

app.use('/uploaded_files', express.static(__dirname + '/uploaded_files'));

var ApplicationController = require('./applications/ApplicationController');
app.use('/applications', authentication.check, ApplicationController);

var AuthController = require('./authentication/AuthController');
app.use('/auth', AuthController);

var DomainController = require('./domains/DomainController');
app.use('/domains', authentication.check, DomainController);

var UserController = require('./user/UserController');
app.use('/users', authentication.check, UserController);

var WSPDomainController = require('./wsp-domains/WSPDomainController');
app.use('/wsp_domains', authentication.check, WSPDomainController);

var WSPDomainStyleController = require('./wsp-domains/WSPDomainStyleController');
app.use('/wsp_styles', authentication.check, WSPDomainStyleController);

var DebuggerController = require('./debugger/DebuggerController');
app.use('/debugger', DebuggerController);

var SmartObjectController = require('./smart-objects/SmartObjectController');
app.use('/smart-objects', authentication.check, SmartObjectController);

var UploadFilesController = require('./upload_files/UploadFilesController');
app.use('/files', authentication.check, UploadFilesController);

var VisualEditorsController = require('./visual-editors/VisualEditorController');
app.use('/visual-editors', authentication.check, VisualEditorsController);

var VEUPDomainElementContoller = require('./veup-domain-description/VEUPDomainElementController');
app.use('/veup-domain-elements', authentication.check, VEUPDomainElementContoller);

var VEUPDomainSourceContoller = require('./veup-domain-description/VEUPDomainSourcesController');
app.use('/veup-domain-sources', authentication.check, VEUPDomainSourceContoller);


module.exports = app;