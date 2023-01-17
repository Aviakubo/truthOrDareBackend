///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 4000
// pull MONGODB_URL from .env
const { PORT = 4000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require('body-parser');

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const TruthsAndDares = new mongoose.Schema({
  statement: { type: String, required: true },
  type : { type: String, enum: ['truth', 'dare'], required: true },
  category: [{ type: String }]
});
const TruthDare = mongoose.model("truthAndDares", TruthsAndDares);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
app.use(bodyParser.json());

///////////////////////////////
// ROUTES
////////////////////////////////

app.get("/truthanddaretest", (req, res) => {
  res.send("hello truth and dares");
});

app.get('/randomtruth/:category', async (req, res) => {
  try {
    const category = req.params.category;
    console.log(req.params.category);
    const randomTruth = await TruthDare.aggregate([
      { $match: { category: category, type: 'truth' } },
      { $sample: { size: 10 } },
      { $project: { statement: 1, _id: 0 } }
    ]);
    const statements = randomTruth.map(item => item.statement);
    res.json(statements);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
});

app.get('/randomdare/:category', async (req, res) => {
  try {
    const category = req.params.category;
    console.log(req.params.category);
    const randomDare = await TruthDare.aggregate([
      { $match: { category: category, type: 'dare' } },
      { $sample: { size: 10 } },
      { $project: { statement: 1, _id: 0 } }
    ]);
    const statements = randomDare.map(item => item.statement);
    res.json(statements);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
});

// CREATE ROUTE
app.post("/truthanddare", async (req, res) => {
  try {
    // send all
    res.json(await TruthDare.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));