const mongoose = require("mongoose");
const express = require("express");
const axios = require('axios');

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
    const user = await User.findOne({username});
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


// ajax
router.post("/get-weather-icon", async (req, res) => {
    const {lat, lon} = req.body;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.APIKEY}`;
    let iconUrl = "";
    let response = {};

    try {
        response = await axios.get(url);
    } catch (err) {}
    
    if (response.data) {
        iconUrl = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
    } 

    res.json({iconUrl});
});

module.exports = router;