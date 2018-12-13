var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var VEUPDomainElement = require('./VEUPDomainElement');

// CREATES A NEW VEUPDomainElement
router.post('/new', function (req, res) {
    let schema = Object.assign({}, req.body);

    VEUPDomainElement.fixFilesData(schema, req.files);

    let veup_domain_element = new VEUPDomainElement(schema);
    veup_domain_element.save(function (err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(veup_domain_element);
        }
    });
});

// RETURNS ALL VEUPDomainElements BASED ON FILTERS
router.post('/filters', function (req, res) {
    let findElems = {};
    if (req.body.filters) {
        Object.entries(req.body.filters).forEach(([key, value]) => findElems[key] = value );
    }

    var query = VEUPDomainElement.find(findElems);

    query.exec(function (err, apps) {
        res.status(200).send(apps);
    });
});

// RETURNS ALL THE VEUPDomainElements FROM THE DATABASE
router.get('/all', function (req, res) {
    VEUPDomainElement.find({}, function (err, veup_domain_elements) {
        if (err) return res.status(500).send("There was a problem finding the visual end-user programming element.");
        res.status(200).send(veup_domain_elements);
    });
});

// GETS A SINGLE VEUPDomainElement FROM THE DATABASE
router.get('/:id', function (req, res) {
    VEUPDomainElement.findById(req.params.id, function (err, veup_domain_element) {
        if (err) return res.status(500).send("There was a problem finding the visual end-user programming domain element.");
        if (!veup_domain_source) return res.status(404).send("No visual end-user programming domain element found.");
        res.status(200).send(veup_domain_element);
    });
});

// DELETES A VEUPDomainElement FROM THE DATABASE
router.delete('/:id', function (req, res) {
    VEUPDomainElement.findByIdAndRemove(req.params.id, function (err, veup_domain_element) {
        if (err) return res.status(500).send("There was a problem deleting the visual end-user programming domain element.");
        res.status(200).send("VEUP Domain Element: " + veup_domain_element.name + " was deleted.");
    });
});

// UPDATES A SINGLE VEUPDomainElement IN THE DATABASE
router.put('/:id', function (req, res) {
    VEUPDomainElement.findByIdAndUpdate(req.params.id, req.body.data, { new: true, upsert: true }, function (err, veup_domain_element) {
        if (err) return res.status(500).send("There was a problem updating the visual end-user programming domain element.");
        res.status(200).send(veup_domain_element);
    });
});


module.exports = router;