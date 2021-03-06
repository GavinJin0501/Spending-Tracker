const mongoose = require("mongoose");
const express = require("express");
const moment = require("moment");

const router = express.Router();
const User = mongoose.model("User");
const Category = mongoose.model("Category");
const Spending = mongoose.model("Spending");
const dateFormat = [moment.ISO_8601, "MM-DD-YYYY HH:mm"];

function sliceDate(s) {
    return s.slice(0, 10) + " " + s.slice(11);
}

router.get("/", (req, res) => {
    res.render("home");
});


router.get("/category/:slug", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/");
    } else {
        const {slug} = req.params;
        const filter = {user: req.user.id};
        let {fromDate, toDate} = req.query;
        fromDate = (fromDate) ? sliceDate(fromDate) : "";
        toDate = (toDate) ? sliceDate(toDate) : "";
        if (req.user.categories.includes(slug)) {
            filter.name = slug;
            const cat = await Category.findOne(filter);
            const temp = cat.spendings;
            const spendings = temp.reduce((acc, ch) => {
                if (!((fromDate && ch.date < fromDate) || (toDate && ch.date > toDate))) {
                    acc.push(ch);
                }
                return acc;
            }, []);
            res.render("category", {slug, spendings, isAll: false});
        } else if (slug === "All") {
            const spendings = [];
            for (const e of req.user.categories) {
                filter.name = e;
                const cat = await Category.findOne(filter);
                const temp = cat.spendings;
                for (const s of temp) {
                    if (!((fromDate && s.date < fromDate) || (toDate && s.date > toDate))) {
                        const obj = {};
                        obj.date = s.date;
                        obj.amount = s.amount;
                        obj.notes = s.notes;
                        obj["_id"] = s["_id"];
                        obj.name = e;
                        spendings.push(obj);
                    }
                }
            }
            res.render("category", {slug, spendings, isAll: true});
        } else {
            res.redirect("/home");
        }
    }
    
});

router.post("/category/:slug", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/");
    } else {
        req.body.date = sliceDate(req.body.date);
        req.body.amount = parseFloat(req.body.amount);
        const {slug} = req.params;
        const filter = {user: req.user.id, name: req.body.category};
        const newSpending = new Spending(req.body);
        const currCategory = await Category.findOne(filter);
        if (currCategory && !!moment(req.body.date, dateFormat, true).isValid() && !isNaN(req.body.amount) && req.body.notes.length <= 50) {
            currCategory.spendings.push(newSpending);
            await currCategory.save();
            res.redirect("/home/category/" + slug);
        } else {
            const cat = await Category.findOne({user: req.user.id, name: req.body.category});
            const spendings = cat.spendings;
            res.render("category", {error: "Invalid input", slug, spendings});
        }
    }
});


router.get("/create-category", (req, res) => {
    res.render("create-category");
});

router.post("/create-category", async (req, res) => {
    const username = req.user.username;
    const toAdd = req.body.name;
    const user = await User.findOne({username});
    if (user && toAdd.trim()) {
        const categories = user.categories;
        const has = categories.reduce((prev, curr) => {
            prev = prev || (curr.toLowerCase() === toAdd.toLowerCase());
            return prev;
        }, false);

        if (has) {
            res.render("create-category", {error: "Name Already Existed"});    
        } else {
            try {
                await new Category({user: user["_id"], name: toAdd}).save();
                user.categories.push(toAdd);
                await user.save();
                req.user.categories = user.categories;
                res.redirect("/home");
            } catch (e) {
                res.render("create-category", {error: "Name Already Existed"});
            }
            
        }
        
    } else {
        res.render("create-category", {error: "Invalid Information"});
    }
});

router.post("/change-category", async (req, res) => {
    const oldName = req.body.oldName;
    const newName = req.body.newName;
    const user = await User.findOne({_id: req.user.id});

    if (!user && !oldName.trim() || !newName.trim() || !user.categories.includes(oldName)) {
        res.render("create-category", {error: "Invalid Information"});
    } else {
        const oldCategory = await Category.findOne({user: req.user.id, name: oldName});
        if (oldCategory) {
            oldCategory.name = newName;
            await oldCategory.save();
            user.categories[user.categories.indexOf(oldName)] = newName;
            await user.save();
            req.user.categories = user.categories;
            res.redirect("/home");
        } else {
            res.render("create-category", {error: "Invalid Information"});
        }
    }
});


router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;