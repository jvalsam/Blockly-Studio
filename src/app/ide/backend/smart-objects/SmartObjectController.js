var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var SmartObject = require('./SmartObject');

// register a device
router.post("/register", function(req, res) {
    req.body.user = req.session.user._id;
    let schema = Object.assign({}, req.body);
    let smart_object = new SmartObject(schema);
    smart_object.save(function(err, smart_object) {
        if (err) {
            console.log(err.message);
            res.status(500).send(err.message);
        } else {
            res.status(200).send(smart_object);
        }
    });
});

// unregister a device
router.delete("/:id", function(req, res) {
    SmartObject.findByIdAndRemove(req.params.id, function (err, smart_object) {
        if (err) {
            return res.status(500).send("There was a problem to unregister the smart device.");
        }
        res.status(200).send("Smart object: " + smart_object.uri + " was unregistered.");
    });
});

// get registered devices
router.get("/registered", function(req, res) {
    SmartObject.find({}, function (err, smart_objects) {
        if (err) {
            return res.status(500).send("There was a problem finding registered smart objects.");
        }
        res.status(200).send(smart_objects);
    });
});

module.exports = router;