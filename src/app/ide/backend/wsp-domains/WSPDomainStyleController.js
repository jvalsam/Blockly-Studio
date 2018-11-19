var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var WSPDomainStyle = require('./WSPDomainStyle');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');


// CREATES A NEW WSP Domain Style Description
router.post('/new', function (req, res) {
    let schema = Object.assign({}, req.body);
    
    let wsp_domain_style = new WSPDomainStyle(schema);
    wsp_domain_style.save(function (err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(wsp_domain_style);
        }
    });
});

// RETURNS ALL THE WSP Domains FROM THE DATABASE
router.get('/all', function (req, res) {
    WSPDomainStyle.find({}, function (err, wsp_domain_styles) {
        if (err) return res.status(500).send("There was a problem finding the wsp domain styles.");
        res.status(200).send(wsp_domain_styles);
    });
});

module.exports = router;