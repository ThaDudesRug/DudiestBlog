const mongoose = require("mongoose");

require("../models/User");
const User = mongoose.model("users");

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "Not Authorized");
        res.redirect("/login");
    },
    noAuth: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect("/");
    }
};
