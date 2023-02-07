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
const mustDoDaresSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  statement: { type: String, required: true },
  who: { type: String, required: true }
});
const MustDoDares = mongoose.model("mustDoDares", mustDoDaresSchema);

const truthsAndDaresSchema = new mongoose.Schema({
  statement: { type: String, required: true },
  type : { type: String, enum: ['truth', 'dare'], required: true },
  category: [{ type: String }]
});
const TruthsAndDares = mongoose.model("truthsAndDares", truthsAndDaresSchema)

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

app.get("/adulttest", (req, res) => {
  res.send("hello adults");
});

app.get("/musthaves", async (req, res) => {
  try {
    const mustHavesStatement = await MustDoDares.find({});
    const mappedDares = mustHavesStatement.map(mustHaves => mustHaves.statement );
    res.status(200).json(mappedDares);
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

app.get("/musthaveswho", async (req, res) => {
  try {
    const mustHavesWho = await MustDoDares.find({});
    const mappedWho = mustHavesWho.map( who => who.who );
    res.status(200).json(mappedWho);
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

app.get("/musthavesnew", async (req, res) => {
  try {
    const mustHavesMap = await MustDoDares.find({});
    const mappedMustHaves = mustHavesMap.map(dare => ({ statement: dare.statement, who: dare.who }));
    res.json(mappedMustHaves);
  } catch (error) {
    res.status(400).json(error);
  }
})

app.get("/alltruths", async (req, res) => {
  try {
    const truths = await TruthsAndDares.find({ type: 'truth' });
    const truthStatements =  truths.map(truth => truth.statement);
    return res.status(200).json(truthStatements);
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

app.get("/alldares", async (req, res) => {
  try {
    const dares = await TruthsAndDares.find({ type: 'dare' });
    const dareStatements = dares.map(dare => dare.statement);
    return res.status(200).json(dareStatements);
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// CREATE ROUTES
app.post("/musthaves", async (req, res) => {
  try {
    // send all
    res.json(await MustDoDares.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

app.post("/allothers", async (req, res) => {
  try {
    // send all
    res.json(await TruthsAndDares.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));