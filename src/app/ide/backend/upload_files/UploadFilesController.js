var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploaded_files',
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post("/upload", upload.array("files"), function(req, res) {
    const paths = [];
    for(const file of req.files) {
        paths.push(req.protocol + "://" + req.hostname + '/' + file.path);
    }
    res.status(200).send(paths);
});

module.exports = router;
