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
// will need two routes since there are two schemas
const Dare = mongoose.model("Players", DareSchema);
const Truth = mongoose.model("TruthOrDare", TruthSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// DARE ROUTES
////////////////////////////////
// create a test route
app.get("/daretest", (req, res) => {
  res.send("hello dares");
});

// DARE INDEX ROUTE
app.get("/dare", async (req, res) => {
  try {
    // send all margs
    res.json(await Dare.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// DARE CREATE ROUTE
app.post("/dare", async (req, res) => {
  try {
    // send all margs
    res.json(await Dare.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// DARE DELETE ROUTE
app.delete("/dare/:id", async (req, res) => {
  try {
    // send all dares
    res.json(await Dare.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// DARE UPDATE ROUTE
app.put("/dare/:id", async (req, res) => {
  try {
    // send all dares
    res.json(
      await Dare.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

///////////////////////////////
// TRUTH ROUTES
////////////////////////////////
// create a test route
app.get("/truthtest", (req, res) => {
    res.send("hello truths");
  });
  
  // TRUTH INDEX ROUTE
  app.get("/truth", async (req, res) => {
    try {
      // send all truths
      res.json(await Truth.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // TRUTH CREATE ROUTE
  app.post("/truth", async (req, res) => {
    try {
      // send all truths
      res.json(await Truth.create(req.body));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // TRUTH DELETE ROUTE
  app.delete("/truth/:id", async (req, res) => {
    try {
      // send all truths
      res.json(await Truth.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // TRUTH UPDATE ROUTE
  app.put("/truth/:id", async (req, res) => {
    try {
      // send all margs
      res.json(
        await Truth.findByIdAndUpdate(req.params.id, req.body, { new: true })
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