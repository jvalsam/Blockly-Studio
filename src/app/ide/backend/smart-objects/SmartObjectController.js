var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var SmartObject = require('./SmartObject');
var multer = require('multer');

const storage = multer.diskStorage({
    destination: 'smart-object-images',
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }   
});

const upload = multer({ storage: storage });

// register a device
router.post("/register", upload.single("image"), function(req, res) {
    req.body.user = req.session.user._id;
    req.body.object = JSON.parse(req.body.object);
    req.body.image = req.protocol + "://" + req.hostname + '/' + req.file.path;
    let schema = Object.assign({}, req.body);
    let smart_object = new SmartObject(schema);
    smart_object.save(function(err, smart_object) {
        if (err) {
            res.status(500).send(err);
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

router.get("/registered", function(req, res) {
    SmartObject.find({}, function (err, smart_objects) {
        if (err) {
            return res.status(500).send("There was a problem finding registered smart objects.");
        }
        res.status(200).send(smart_objects);
    });
});

module.exports = router;