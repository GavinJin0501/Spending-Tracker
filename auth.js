const passport = require("passport");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local");
const argon2 = require("argon2");


const User = mongoose.model("User");

// reference:https://www.passportjs.org/tutorials/password/
// implement passport authentication
passport.use(new LocalStrategy(function verify(username, password, cb) {
    User.findOne({username: username}, async function(err, user) {
        if (err) {return cb(err);}
        else if (!user) {return cb(null, false, {message: "Incorrect username or password"});}
        try {
            const dbPwd = user.hash;
            const check = await argon2.verify(dbPwd, password);
            if (check) {
                return cb(null, user);
            } else {
                return cb(null, false, {message: "Incorrect username or password"});
            }
          } catch (err) {
            return cb(err);
          }
    });
}));


passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, {username: user.username, categories: user.categories});
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});