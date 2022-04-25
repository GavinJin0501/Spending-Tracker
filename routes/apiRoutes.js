const express = require("express");
const router = express.Router();
const axios = require('axios');


// ajax
router.post("/get-weather-icon", async (req, res) => {
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
});


module.exports = router;