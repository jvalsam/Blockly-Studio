var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var VEUPDomainSource = require('./VEUPDomainSources');


// CREATES A NEW VEUPDomainSource
router.post('/new', function (req, res) {
    let schema = Object.assign({}, req.body);

    VEUPDomainSource.fixFilesData(schema, req.files);
    
    let veup_domain_source = new VEUPDomainSource(schema);
    veup_domain_source.save(function (err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(veup_domain_source);
        }
    });
});

// RETURNS ALL VEUPDomainSources BASED ON FILTERS
router.post('/filters', function (req, res) {
    let findElems = {};
    if (req.body.filters) {
        Object.entries(req.body.filters).forEach(([key, value]) => findElems[key] = value );
    }

    var query = VEUPDomainSource.find(findElems);

    query.exec(function (err, apps) {
        res.status(200).send(apps);
    });
});

// RETURNS ALL THE VEUPDomainSources FROM THE DATABASE
router.get('/all', function (req, res) {
    VEUPDomainSource.find({}, function (err, veup_domain_sources) {
        if (err) return res.status(500).send("There was a problem finding the visual end-user programming domain source.");
        res.status(200).send(veup_domain_sources);
    });
});

// GETS A SINGLE VEUPDomainSource FROM THE DATABASE
router.get('/:id', function (req, res) {
    VEUPDomainSource.findById(req.params.id, function (err, veup_domain_source) {
        if (err) return res.status(500).send("There was a problem finding the visual end-user programming domain source.");
        if (!veup_domain_source) return res.status(404).send("No visual end-user programming domain source found.");
        res.status(200).send(veup_domain_source);
    });
});

// DELETES A VEUPDomainSource FROM THE DATABASE
router.delete('/:id', function (req, res) {
    VEUPDomainSource.findByIdAndRemove(req.params.id, function (err, veup_domain_source) {
        if (err) return res.status(500).send("There was a problem deleting the visual end-user programming domain source.");
        res.status(200).send("VEUP Domain Source: " + veup_domain_source.name + " was deleted.");
    });
});

// UPDATES A SINGLE VEUPDomainSource IN THE DATABASE
router.put('/:id', function (req, res) {
    VEUPDomainSource.findByIdAndUpdate(req.params.id, req.body.data, { new: true, upsert: true }, function (err, veup_domain_source) {
        if (err) return res.status(500).send("There was a problem updating the visual end-user programming domain source.");
        res.status(200).send(veup_domain_source);
    });
});


module.exports = router;