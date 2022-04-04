const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");
const async = require("hbs/lib/async");


const router = express.Router();
const User = mongoose.model("User");
const Category = mongoose.model("Category");


router.get("/", (req, res) => {
    res.render("home");
});


router.get("/create-category", (req, res) => {
    res.render("create-category");
});


router.post("/create-category", async (req, res) => {
    const username = req.user.username;
    const toAdd = req.body.name;
    const user = await User.findOne({username}).exec();
    if (user) {
        const categories = user.categories;
        let has = false;

        categories.forEach(e => {
            if (e.toLowerCase() === toAdd.toLowerCase()) {
                has = true;
            }
        });

        if (has) {
            res.render("create-category", {error: "Name Already Existed"});    
        } else {
            await new Category({user: user["_id"], name: toAdd}).save();
            user.categories.push(toAdd);
            req.user.categories = user.categories;
            await user.save();
            res.redirect("/home");
        }
        
    } else {
        res.render("create-category", {error: "Invalid Information"});
    }
});


router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;