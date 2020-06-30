const mongoose = require("mongoose");

require("../models/User");
const User = mongoose.model("users");

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.status(404).json("Not authenticated");
    },
    noAuth: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect("/");
    },
};
