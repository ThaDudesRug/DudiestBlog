const express = require("express");
const passport = require("passport");
const bcryptjs = require("bcryptjs");
const router = express.Router();

const User = require("../models/User");

router.get("/", (req, res) => {
    res.render('index');
});

router.post("/register", async (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;

    try {
        const user = await User.find({
            $or: [
                { email: { $regex: new RegExp("^" + email + "$", "i") } },
                { username: { $regex: new RegExp("^" + username + "$", "i") } }
            ]
        });

        if (user) {
            user.forEach(thisUser => {
                if (!thisUser.email.localeCompare(email))
                    errors.email = "Email is already in use";
                if (!thisUser.username.localeCompare(username))
                    errors.username = "Username is already in use";
            });
        }

        const newUser = new User({
            email,
            username,
            name: req.body.name,
            password: req.body.password
        });

        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;

                return newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
            });
        });
    } catch (e) {
        next(e);
    }
});

router.post("/login", (req, res, next) => {
    User.findOne({
        username: { $regex: new RegExp(req.body.username, "i") }
    })
        .then(user => {
            if (user.isVerified) {
                passport.authenticate("local", {
                    successRedirect: "/",
                    failureRedirect: "/login"
                })(req, res, next);
            } else {
                req.flash("error_msg", "Account is not yet active");
                res.redirect("/login");
            }
        })
        .catch(err => console.log(err));
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

module.exports = router;
