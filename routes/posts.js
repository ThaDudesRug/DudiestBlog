const express = require("express");
const { noAuth, ensureAuthenticated } = require("../helpers/auth");
const router = express.Router();

const Post = require("../models/Post");

router.get("/", (req, res) => {
    const posts = Post.find()
        .then((data) => {
            res.render("blog/index", {
                posts: data.map((post) => post.toJSON()),
            });
        })
        .catch((err) => console.log(err));
});

router.post("/post", ensureAuthenticated, (req, res, next) => {
    const newPost = new Post({
        title: "Test Post",
        imgPath:
            "https://content.fortune.com/wp-content/uploads/2016/11/gettyimages-172279787.jpg",
        postData:
            "Literally venmo before they sold out, DIY heirloom forage polaroid offal yr pop-up selfies health goth. Typewriter scenester hammock truffaut meditation, squid before they sold out polaroid portland tousled taxidermy vice. Listicle butcher thundercats, taxidermy pitchfork next level roof party crucifix narwhal kinfolk you probably haven't heard of them portland small batch.",
    });

    newPost
        .save()
        .then(() => {
            res.render("blog/index");
        })
        .catch((err) => console.log(err));
});

module.exports = router;
