const mongoose = require("mongoose");
const express = require("express");
const argon2 = require("argon2");
const passport = require("passport");
const { nextTick } = require("process");


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
    const {username, password} = req.body
    if (username.length < 3 || username.length > 15) {
        res.render("register", {error: "Username Invalid"});
    } else {
        const existingUser = await User.findOne({username: username}).exec();
        if (!existingUser) {
            // hash: $argon2i$v=19$m=4096,t=3,p=1$z+t8lqXpDjhIJt14Lwf0NQ$JfUcW6NfQH12lPU+D67/u5rikHJyyk6mYCYKhjKcfbU
            const hash = await argon2.hash(password);
            let savedUser = await new User({username: username, hash: hash}).save();
            const savedFood = await new Category({user: savedUser["_id"], name: "Food"}).save();
            const savedEntertainment = await new Category({user: savedUser["_id"], name: "Entertainment"}).save();
            const savedTransportation = await new Category({user: savedUser["_id"], name: "Transportation"}).save();
            const savedShopping = await new Category({user: savedUser["_id"], name: "Shopping"}).save();
            
            savedUser.categories = [savedFood["_id"], savedEntertainment["_id"], savedTransportation["_id"], savedShopping["_id"]];
            savedUser = await savedUser.save();

            const user = {username: savedUser.username, categories: savedUser.categories};
            req.login(user, function(err) {
                if (err) {res.redirect("/");}
                res.redirect("/home");
            });
        } else {
            res.render("register", {error: "Username Invalid"});
        }
    }
});


module.exports = router;