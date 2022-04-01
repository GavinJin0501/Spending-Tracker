const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");


const router = express.Router();
const User = mongoose.model("User");
const Category = mongoose.model("Category");


router.get("/", (req, res) => {
    res.render("home");
});

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;