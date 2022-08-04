const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const Models = require("./models.js");

const Monuments = Models.Monument;

mongoose.connect("mongodb://localhost:27017/frenchStateHistoricalMonumentsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ========================
// GET routes
// ========================

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to the French State Historical Monuments API!");
});

// READ - Returns a list of all Monuments
app.get("/monuments", (req, res) => {
  // res.send("This should render the list of all monuments available in the API");
  Monuments.find()
    .then(monuments => {
      res.status(201).json(monuments);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// READ - Returns data in JSON format of specific Monument by monumentId
app.get("/monuments/:monumentId", (req, res) => {
  // res.send("This should render data of a specific monument");
  Monuments.findOne({ _id: req.params.monumentId })
    .then(monument => {
      if (monument) {
        res.status(200).json(monument);
      } else {
        res.status(400).send("No such a monument in the database.");
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// READ - Returns data in JSON format of all monuments located in a given city
app.get("/monuments/locations/:cityLocation", (req, res) => {
  // res.send("This should render the list of all monuments available in the API");
  Monuments.find({ CityLocation: req.params.cityLocation })
    .then(monuments => {
      console.log(req.params.cityLocation);
      console.log(monuments);
      res.status(201).json(monuments);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
