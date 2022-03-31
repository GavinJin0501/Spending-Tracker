const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");


const router = express.Router();
const User = mongoose.model("User");
const Category = mongoose.model("Category");


router.get("/", (req, res) => {
    const data = req.session.passport.user;
    res.render("home", data);
});



module.exports = router;