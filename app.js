// pre-run files
require("./db.js");


// require modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require('express-session');


// define global variables
const app = express();
const User = mongoose.model("User");
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};


// set engine for app
app.set("view engine", "hbs");


// use middlewares
app.use(session(sessionOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// handle routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/login", (req, res) => {
    console.log(req.body.username, req.body.password);
    res.redirect("/");
});

app.post("/register", (req, res) => {
    console.log(req.body);
    res.redirect("/");
});


app.listen(3000);