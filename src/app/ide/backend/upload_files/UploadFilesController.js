var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploaded_files/',
    filename: function (req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

router.post("/upload", (...args) => {
    return upload.array("files")(...args);
}, function(req, res) {
    const paths = [];
    for(const file of req.files) {
        paths.push(req.protocol + "://" + req.headers.host + '/' + file.destination + file.filename);
    }
    res.status(200).send(paths);
});



module.exports = router;
