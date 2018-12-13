var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var VisualEditor = require('./VisualEditor');

// Registers new Visual Editor in the Platform
router.post('/new', function (req, res) {
    let schema = Object.assign({}, req.body);
    
    let visual_editor = new VisualEditor(schema);
    visual_editor.save(function (err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(visual_editor);
        }
    });
});

// RETURNS ALL REGISTERED VISUAL EDITORS FROM THE DATABASE
router.get('/all', function (req, res) {
    VisualEditor.find({}, function (err, visual_editors) {
        if (err) return res.status(500).send("There was a problem finding the registered visual editors.");
        res.status(200).send(visual_editors);
    });
});

module.exports = router;