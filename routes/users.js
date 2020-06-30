const express = require("express");
const passport = require("passport");
const bcryptjs = require("bcryptjs");
const router = express.Router();

const User = require("../models/User");

router.get('/login', (req, res)=>{
    res.render('users/login');
});

// router.get('/register', (req, res)=>{
//     res.render('users/register');
// });

// router.post("/register", async (req, res, next) => {
//     const email = req.body.email;
//     const username = req.body.username;
//     let errors = [];

//     if(req.body.password != req.body.password2){
//         errors.push({text: "Passwords do not match"});
//     }

//     try {
//         const user = await User.find({
//             $or: [
//                 { email: { $regex: new RegExp("^" + email + "$", "i") } },
//                 { username: { $regex: new RegExp("^" + username + "$", "i") } }
//             ]
//         });

//         if (user) {
//             user.forEach(thisUser => {
//                 if (!thisUser.email.localeCompare(email))
//                     errors.push({text: "Email is already in use"});
//                     //errors.email = "Email is already in use";
//                 if (!thisUser.username.localeCompare(username))
//                     errors.push({text: "Username is already in use"});    
//                     //errors.username = "Username is already in use";
//             });
//         }

//         if(errors.length > 0){
//             res.render('users/register', {
//                 errors : errors,
//                 username : req.body.username,
//                 email : req.body.email,
//                 password : req.body.password,
//                 password2 : req.body.password2
//             });
//         } else {
//             const newUser = new User({
//                 email,
//                 username,
//                 password: req.body.password
//             });
    
//             bcryptjs.genSalt(10, (err, salt) => {
//                 bcryptjs.hash(newUser.password, salt, (err, hash) => {
//                     if (err) throw err;
//                     newUser.password = hash;

//                     newUser.save();
    
//                     res.render('users/login', {success_msg: 'Welcome, ' + username + '! Please login.'});
    
//                     /*return newUser
//                         .save()
//                         .then(user => res.json(user))
//                         .catch(err => console.log(err));*/
//                 });
//             });
//         }
//     } catch (e) {
//         next(e);
//     }
// });

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
});

//Logout route
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;
