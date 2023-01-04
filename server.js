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
const PlayerSchema = new mongoose.Schema({
  name: String,
  gender: String
});
const TruthOrDareSchema = new mongoose.Schema({
    dare: Boolean,
    instructions: String,
});
// will need two routes since there are two schemas
const Player = mongoose.model("Players", PlayerSchema);
const TruthOrDare = mongoose.model("TruthOrDare", TruthOrDareSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// PLAYER ROUTES
////////////////////////////////
// create a test route
app.get("/playa", (req, res) => {
  res.send("hello playa");
});

// PLAYER INDEX ROUTE
app.get("/players", async (req, res) => {
  try {
    // send all margs
    res.json(await Player.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PLAYER CREATE ROUTE
app.post("/players", async (req, res) => {
  try {
    // send all margs
    res.json(await Player.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PLAYER DELETE ROUTE
app.delete("/players/:id", async (req, res) => {
  try {
    // send all marg
    res.json(await Player.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PLAYER UPDATE ROUTE
app.put("/players/:id", async (req, res) => {
  try {
    // send all margs
    res.json(
      await Player.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

///////////////////////////////
// TRUTH OR DARE ROUTES
////////////////////////////////
// create a test route
app.get("/truth", (req, res) => {
    res.send("hello truth or dare");
  });
  
  // TRUTH OR DARE INDEX ROUTE
  app.get("/truthordare", async (req, res) => {
    try {
      // send all margs
      res.json(await TruthOrDare.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // TRUTH OR DARE CREATE ROUTE
  app.post("/truthordare", async (req, res) => {
    try {
      // send all margs
      res.json(await TruthOrDare.create(req.body));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // TRUTH OR DARE DELETE ROUTE
  app.delete("/truthordare/:id", async (req, res) => {
    try {
      // send all marg
      res.json(await TruthOrDare.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // TRUTH OR DARE UPDATE ROUTE
  app.put("/truthordare/:id", async (req, res) => {
    try {
      // send all margs
      res.json(
        await TruthOrDare.findByIdAndUpdate(req.params.id, req.body, { new: true })
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