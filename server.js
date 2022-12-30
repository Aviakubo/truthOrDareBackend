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
const MargSchema = new mongoose.Schema({
  name: String,
  instructions: String,
  ingredients: String,
  yield: Number,
  image: String
});

const Marg = mongoose.model("Marg", MargSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("hello world");
});

// MARG INDEX ROUTE
app.get("/marg", async (req, res) => {
  try {
    // send all margs
    res.json(await Marg.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// MARG CREATE ROUTE
app.post("/marg", async (req, res) => {
  try {
    // send all margs
    res.json(await Marg.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// MARG DELETE ROUTE
app.delete("/marg/:id", async (req, res) => {
  try {
    // send all marg
    res.json(await Marg.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// MARG UPDATE ROUTE
app.put("/marg/:id", async (req, res) => {
  try {
    // send all margs
    res.json(
      await Marg.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));