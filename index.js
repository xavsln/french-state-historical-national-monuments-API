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

// Returns a list of all Monuments
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

// Returns data in JSON format of specific Monument
app.get("/monuments/:monumentName", (req, res) => {
  res.send("This should render data of a specific monument");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
