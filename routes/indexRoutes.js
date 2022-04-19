const mongoose = require("mongoose");
const express = require("express");
const argon2 = require("argon2");
const passport = require("passport");


const router = express.Router();
const User = mongoose.model("User");
const Category = mongoose.model("Category");

// handle routes
router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
}));

router.post("/register", async (req, res) => {
    const {username, password} = req.body;
    if (username.length < 3 || username.length > 15) {
        res.render("register", {error: "Username Invalid"});
    } else {
        const existingUser = await User.findOne({username: username}).exec();
        if (!existingUser) {
            const hash = await argon2.hash(password);
            const savedUser = await new User({username: username, hash: hash, categories: ["Food", "Entertainment", "Transportation", "Shopping"]}).save();
            await new Category({user: savedUser["_id"], name: "Food"}).save();
            await new Category({user: savedUser["_id"], name: "Entertainment"}).save();
            await new Category({user: savedUser["_id"], name: "Transportation"}).save();
            await new Category({user: savedUser["_id"], name: "Shopping"}).save();
            
            const user = {username: savedUser.username, categories: savedUser.categories};
            req.login(user, function(err) {
                if (err) {res.redirect("/");}
                res.redirect("/home");
            });
        } else {
            console.log("HAHAHA");
            res.render("register", {error: "Username Invalid"});
        }
    }
});


module.exports = router;