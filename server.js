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
const DareSchema = new mongoose.Schema({
  instructions: String
});
const TruthSchema = new mongoose.Schema({
    instructions: String
});
const TruthsAndDares = new mongoose.Schema({
  statement: { type: String, required: true },
  type : { type: String, enum: ['truth', 'dare'], required: true },
  category: [{ type: String }]
});
// will need two routes since there are two schemas
const Dare = mongoose.model("dare", DareSchema);
const Truth = mongoose.model("truth", TruthSchema);
const TruthDare = mongoose.model("truthAndDares", TruthsAndDares);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// ROUTES
////////////////////////////////

app.get("/truthanddaretest", (req, res) => {
  res.send("hello truth and dares");
});

app.get("/truthanddare", async (req, res) => {
  try {
    res.json(await TruthDare.find({}));
  } catch {
    res.status(400).json(error);
  }
});

app.get("/truthanddare/alltruths", async (req, res) => {
  try {
    res.json(await TruthDare.find({type: ['truth']}));
  } catch {
    res.status(400).json(error);
  }
});

app.get("/truthanddare/alldares", async (req, res) => {
  try {
    res.json(await TruthDare.find({type: ['dare']}));
  } catch {
    res.status(400).json(error);
  }
});

app.get("/truthanddare/classic", async (req, res) => {
  try {
    res.json(await TruthDare.find({category: ['classic']}));
  } catch {
    res.status(400).json(error);
  }
});

app.get("/truthanddare/teens", async (req, res) => {
  try {
    res.json(await TruthDare.find({category: ['teens']}));
  } catch {
    res.status(400).json(error);
  }
});

app.get("/truthanddare/party", async (req, res) => {
  try {
    res.json(await TruthDare.find({category: ['party']}));
  } catch {
    res.status(400).json(error);
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