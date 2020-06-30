const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const path = require("path");

const keys = require("./config/keys");

const users = require("./routes/users");
const posts = require("./routes/posts");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./config/passport")(passport);

app.use(methodOverride("_method"));

app.use(
    session({
        secret: keys.secretOrKey,
        resave: true,
        saveUninitialized: true,
    })
);

app.use(express.static(path.join(__dirname, "/public")));

mongoose.set("useFindAndModify", false);
mongoose
    .connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

app.get("/", (req, res) => {
    res.render("index");
});

app.use("/auth", users);
app.use("/blog", posts);

app.listen(keys.port, () => console.log(`Server running on port ${keys.port}`));
