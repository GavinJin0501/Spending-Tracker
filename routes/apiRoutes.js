const express = require("express");
const mongoose = require("mongoose");
const axios = require('axios');
const moment = require("moment");

const Category = mongoose.model("Category");
const router = express.Router();
const dateFormat = [moment.ISO_8601, "MM-DD-YYYY HH:mm"];


router.post("/get-weather-icon", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.json({error: "What are you thinking about?"});
    } else {
        const {lat, lon} = req.body;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.APIKEY}`;
        let iconUrl = "";
        let response = {};

        try {
            response = await axios.get(url);
        } catch (err) {
            console.log(err);
        }
        
        if (response.data) {
            iconUrl = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
            iconDes = response.data.weather[0].description
            req.user.iconUrl = iconUrl;
            req.user.iconDes = iconDes;
        }

        res.json({iconUrl, iconDes});
    }
});


router.post("/edit-spending", async (req, res) => {
    if (!req.isAuthenticated) {
        res.json({error: "What are you thinking about?"});
    } else {
        if (req.body.notes.length >= 50 || isNaN(parseFloat(req.body.amount)) || !moment(req.body.date, dateFormat, true).isValid()) {
            res.json({error: "Invalid information"});
        } else {
            const filter = {user: req.user.id, name: req.body.name};
            const cat = await Category.findOne(filter);
            const dbSpendings = cat.spendings;
            const obj = dbSpendings.find(s => s._id.toString() === req.body._id);
            
            if (obj) {
                obj.date = req.body.date;
                obj.amount = parseFloat(req.body.amount);
                obj.notes = req.body.notes;
                await cat.save();
                res.json({msg: "success"});
            } else {
                res.json({error: "Invalid information"});
            }
        }
        
    }
    
});


router.post("/delete-spending", async (req, res) => {
    if (!req.isAuthenticated) {
        res.json({error: "What are you thinking about?"});
    } else {
        const filter = {user: req.user.id, name: req.body.name};
        const cat = await Category.findOne(filter);

        cat.spendings = cat.spendings.filter(s => {
            return s._id.toString() !== req.body._id;
        });
        try {
            await cat.save();
            res.json({msg: "success"});
        } catch (error) {
            res.json({error});
        }
        
    }
});

module.exports = router;