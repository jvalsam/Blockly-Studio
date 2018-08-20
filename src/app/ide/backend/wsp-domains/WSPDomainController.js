var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var WSPDomain = require('./WSPDomain');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');




// CREATES A NEW WSP Domain Description
router.post('/new', function (req, res) {
    let schema = Object.assign({}, req.body);
    
    let wsp_domain = new WSPDomain(schema);
    wsp_domain.save(function (err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(wsp_domain);
        }
    });
});

// RETURNS ALL THE WSP Domains FROM THE DATABASE
router.get('/all', function (req, res) {
    WSPDomain.find({}, function (err, wsp_domains) {
        if (err) return res.status(500).send("There was a problem finding the wsp domain descriptions.");
        res.status(200).send(wsp_domains);
    });
});

module.exports = router;