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
const unauthPath = indexRoutes.stack.map(r => r = r.route.path);
const authPath = homeRoutes.stack.map(r => r = (r.route.path !== "/") ? "/home" + r.route.path : "/home");
// console.log("unauth:", unauthPath);
// console.log("auth:", authPath);


// set engine for app
app.set("view engine", "hbs");

// use middlewares
app.use((req, res, next) => {   // remove trailing slash -- ref: https://searchfacts.com/url-trailing-slash/
	if (req.path[-1] === '/' && req.path.length > 1) {
		const query = req.url.slice(req.path.length);
		res.redirect(301, req.path.slice(0, -1) + query);
	} else {
		next();
	}
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session(sessionOptions));
app.use(passport.authenticate("session"));
app.use((req, res, next) => {   // restrict access
    if (req.isAuthenticated() && unauthPath.includes(req.path)) {
        res.redirect("/home");
    } else if (!req.isAuthenticated() && authPath.includes(req.path)) {
        res.redirect("/");
    } else {
        next();
    }
});
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});


// use router middlewares
app.use("/", indexRoutes);
app.use("/home", homeRoutes);


app.listen(process.env.PORT || 3000);