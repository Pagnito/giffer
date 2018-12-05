const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes.js');
const path = require('path');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const compression = require('compression');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const PORT = process.env.PORT || 2000;
 //init userModel
require("./models/user-model");
 //init mongodb
  mongoose.connect(keys.mongoURI,
  { useNewUrlParser: true })
  .then(()=>{console.log('Connected to Mongo')})
  .catch(err=>{
    throw err;
  })
  console.log('MONGOURI IS', process.env.mongoURI)
  app.use(compression());
  ////user bodyparser to properly recieve data/////
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  ////use cookie session to encrypt cookie from authentication and admniister its lifespan////

  app.use(
    cookieSession({
      maxAge:222222222222,
      keys: ["asjdjfntwof"]
    })
  );

  ////initialize passport/////
  app.use(passport.initialize());
  app.use(passport.session());

  ////activate routes/////
  require("./routes")(app);

  app.use(express.static(path.resolve(__dirname, "client")));
  app.get("/service-worker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "service-worker.js"));
  });
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "index.html"));
  });

  app.listen(PORT);
