// pre-run files
require('dotenv').config({path: __dirname + '/.env'});
require("./db.js");
require("./auth.js");


// require modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require('express-session');
const passport = require("passport");
const indexRoutes = require("./routes/indexRoutes");
const homeRoutes = require("./routes/homeRoutes");


// define global variables
const app = express();
const sessionOptions = {
    secret: (process.env.secret) ? process.env.secret : "Guess Wat it is",
    resave: false,
    saveUninitialized: false
};


// set engine for app
app.set("view engine", "hbs");


// use middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session(sessionOptions));
app.use(passport.authenticate("session"));


// use router middlewares
app.use("/", indexRoutes);
app.use("/home", homeRoutes);


app.listen(3000);