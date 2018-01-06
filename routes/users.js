const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');

require('../models/Users');

const User = mongoose.model("Users");


router.get('/login', (req,res)=>{
    res.render('users/login');
});

router.get('/register', (req,res)=>{
    res.render('users/register');
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

router.post('/register',(req,res)=>{
    let errors = [];
    if(req.body.password !== req.body.password2){
        errors.push({message: "passwords doesn't match!! Please input a matching one."});
    }
    if(req.body.password.length < 5){
        errors.push({message: "Password length is less than 5 Chars"});
    }
    if(errors.length > 1){
        res.render('users/register', {
            error_list:errors,
            username: req.body.username,
            email: req.body.email,
            password:req.body.password,
            password2:req.body.password2
        });
    }
    else{
        User.findOne({email: req.body.email})
            .then(user=> {
                if(user){
                    req.flash('error_msg', 'User Already Exists with the same Email');
                    res.redirect('/users/register');
                }
                else{
                    const newUser = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if(err) throw err;
                            else{
                                newUser.password = hash;
                                newUser.save().then(user =>{
                                    req.flash('success_msg', 'Account Created Successfully')
                                    res.redirect('/users/login');
                                }).catch(err => console.log(err));
                            }
                        });
                    });
                }
            })
    }
});

router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg', 'Logged out ...!')
    res.redirect('/users/login');
});

module.exports = router