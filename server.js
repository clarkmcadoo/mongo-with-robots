var express = require("express");
var app = express();
var port = 9000;
const dbUrl = "mongodb://localhost:27017/robotData";
var mustacheExpress = require("mustache-express");
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

app.use(express.static("./public"));

app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

var DB;
var robots;

mongoClient.connect(dbUrl, function(err, db) {
  if (err) {
    console.warn("Error connecting to database", err);
  }

  DB = db;
  robots = db.collection("robots");
});

app.get("/", (req, res) => {
  robots.find({}).toArray(function(err, foundRobots) {
    if (err) {
      res.status(500).send(err);
    }

    res.render("index", { allData: foundRobots });
  });
});

app.get("/isnotemployed", (req, res) => {
  robots.find({ job: null }).toArray(function(err, foundRobots) {
    if (err) {
      res.status(500).send(err);
    }

    res.render("index", { allData: foundRobots });
  });
});

app.get("/isemployed", (req, res) => {
  robots.find({ job:{ $ne : null }}).toArray(function(err, foundRobots) {
    if (err) {
      res.status(500).send(err);
    }

    res.render("index", { allData: foundRobots });
  });
});

app.get("/:id", (req, res) => {
  robots.findOne({ id: parseInt(req.params.id) }, function(err, foundRobots) {
    if (err) {
      res.status(500).send(err);
    }

    res.render("profile", { allData: foundRobots });
  });
});

app.listen(port, function() {
  console.log("Your user directory is running in PORT: " + port);
});
