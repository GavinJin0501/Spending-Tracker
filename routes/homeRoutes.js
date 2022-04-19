const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();
const User = mongoose.model("User");
const Category = mongoose.model("Category");
const Spending = mongoose.model("Spending");

router.get("/", (req, res) => {
    res.render("home");
});


router.get("/create-category", (req, res) => {
    res.render("create-category");
});

router.get("/category/:slug", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/");
    } else {
        const {slug} = req.params;
        const filter = {user: req.user.id};
        if (req.user.categories.includes(slug)) {
            filter.name = slug;
            const cat = await Category.findOne(filter);
            const spendings = cat.spendings;
            res.render("category", {slug, spendings});
        } else if (slug === "All") {
            const spendings = [];
            for (const e of req.user.categories) {
                filter.name = e;
                const cat = await Category.findOne(filter);
                const temp = cat.spendings;
                spendings.push(...temp);
            }
            res.render("category", {slug, spendings});
        } else {
            res.redirect("/home");
        }
    }
    
});

router.post("/category/:slug", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/");
    } else {
        const {slug} = req.params;
        const filter = {user: req.user.id, name: slug};
        const newSpending = new Spending(req.body);
        const currCategory = await Category.findOne({user: req.user.id, name: slug});
        if (currCategory) {
            currCategory.spendings.push(newSpending);
            await currCategory.save();
            res.redirect("/home/category/" + slug);
        } else {
            res.render("category", {error: "Invalid input"});
        }
    }
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

router.post("/change-category", async (req, res) => {
    const oldName = req.body.oldName;
    const newName = req.body.newName;

    if (!oldName || !newName) {
        res.render("create-category", {error1: "Invalid Information"})
    }


    // const [oldName, newName] = req.body;
    // console.log(oldName, newName);
    res.redirect("/home");
});


router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;