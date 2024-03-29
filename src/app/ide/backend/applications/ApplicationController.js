var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Application = require("./Application");
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
var fs = require("fs");
var ApplicationModel = require("../../shared/models/ApplicationModel");

function flatten(obj) {
  var result = Object.create({});
  for (var key in obj) {
    result[key] = obj[key];
  }
  return result;
}

// CREATES A NEW APPLICATION
router.post("/new", function (req, res) {
  let schema = Object.assign({}, JSON.parse(req.body.data));

  Application.fixFilesData(schema, req.files);

  let app = new Application(schema);
  app.save(function (err) {
    if (err) {
      res.status(500).send(err);
    } else {
      let data = JSON.stringify(flatten(app));
      res.status(200).send(data);
    }
  });
});

// RETURNS ALL APPS BASED ON FILTERS
router.post("/filters", function (req, res) {
  let findElems = { "author.id": req.session.user._id };
  if (req.body.filters) {
    Object.entries(req.body.filters).forEach(
      ([key, value]) => (findElems[key] = value)
    );
  }

  var query = Application.find(findElems);

  query.exec(function (err, apps) {
    res.status(200).send(apps);
  });
});

// RETURNS ALL THE APPLICATIONS FROM THE DATABASE
router.get("/all", function (req, res) {
  Application.find({}, function (err, apps) {
    if (err)
      return res
        .status(500)
        .send("There was a problem finding the applications.");
    res.status(200).send(apps);
  });
});

router.get("/user/details/:id", function (req, res) {
  var query = Application.find({ "author.id": req.params.id });
  query.select(ApplicationModel.getElements());
  query.exec(function (err, apps) {
    res.status(200).send(apps);
  });
});

// RETURNS ALL THE AUTHOR'S APPLICATIONS OF THE DATABASE
router.get("/author/:id", function (req, res) {
  Application.find({ "author.id": req.params.id }, function (err, apps) {
    if (err)
      return res
        .status(500)
        .send("There was a problem finding the applications.");
    res.status(200).send(apps);
  });
});

// GETS A SINGLE DOMAIN FROM THE DATABASE
router.get("/:id", function (req, res) {
  Application.findById(req.params.id, function (err, app) {
    if (err)
      return res
        .status(500)
        .send("There was a problem finding the application.");
    if (!app) return res.status(404).send("No application found.");
    res.status(200).send(JSON.stringify(flatten(app)));
  });
});

// DELETES A DOMAIN FROM THE DATABASE
router.delete("/:id", function (req, res) {
  Application.findByIdAndRemove(req.params.id, function (err, app) {
    if (err)
      return res
        .status(500)
        .send("There was a problem deleting the application.");
    res.status(200).send("Application: " + app.name + " was deleted.");
  });
});

// UPDATES A SINGLE DOMAIN IN THE DATABASE
router.put("/:id", function (req, res) {
  Application.findByIdAndUpdate(
    req.params.id,
    Object.assign({}, JSON.parse(req.body.data)),
    { new: true, upsert: true },
    function (err, app) {
      if (err)
        return res
          .status(500)
          .send("There was a problem updating the application.");
      res.status(200).send(JSON.stringify(flatten(app)));
    }
  );
});

module.exports = router;
