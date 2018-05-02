var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var Domain = require('./Domain');


// CREATES A NEW DOMAIN
router.post('/', function (req, res) {
    let schema = Object.assign({}, req.body);
    if (req.files && req.files.img) {
        schema.img.data = fs.readFileSync(req.files.img.path);
        schema.img.contentType = req.files.img.type;
    }
    else {
        schema.img.fa = req.body.img;
    }
    let domain = new Domain(schema);
    domain.save(function (err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(domain);
        }
    });
});

router.post('/file', multipartMiddleware, function (req, res) {
    let domain = new Domain(req.body);

    var propObj = req.files.propName;
    var fileName = propObj.fileName;
    var path = propObj.path;
    var type = propObj.type;
    var name = propObj.name;
    var contentType = propObj["headers"]["content-type"];
    var originalFilename = propObj.originalFilename;

});

// RETURNS ALL THE DOMAINS FROM THE DATABASE
router.get('/', function (req, res) {
    Domain.find({}, function (err, domains) {
        if (err) return res.status(500).send("There was a problem finding the domains.");
        res.status(200).send(domains);
    });
});

// GETS A SINGLE DOMAIN FROM THE DATABASE
router.get('/:id', function (req, res) {
    Domain.findById(req.params.id, function (err, domain) {
        if (err) return res.status(500).send("There was a problem finding the domain.");
        if (!domain) return res.status(404).send("No domain found.");
        domain.status(200).send();
    });
});

// RETURNS ALL THE AUTHOR'S DOMAIN OF THE DATABASE
router.get('/user/:id', function (req, res) {
    Domain.find({ 'author.id': req.params.id }, function (err, domains) {
        if (err) return res.status(500).send("There was a problem finding the applications.");
        res.status(200).send(domains);
    });
});

// DELETES A DOMAIN FROM THE DATABASE
router.delete('/:id', function (req, res) {
    Domain.findByIdAndRemove(req.params.id, function (err, domain) {
        if (err) return res.status(500).send("There was a problem deleting the domain.");
        res.status(200).send("Domain: " + domain.name + " was deleted.");
    });
});

// UPDATES A SINGLE DOMAIN IN THE DATABASE
router.put('/:id', function (req, res) {
    Domain.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, domain) {
        if (err) return res.status(500).send("There was a problem updating the domain.");
        res.status(200).send(domain);
    });
});


module.exports = router;