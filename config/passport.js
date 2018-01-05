const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

require('../models/Users.js');



const User = mongoose.model('Users');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email,password,done)=>{
        User.findOne({email:email}).then(user =>{
            if(!user){
                return done(null, false, {message: 'No user found'});
            }
            else{
                bcrypt.compare(password, user.password,(err, isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    }
                    else{
                        return done(null, false, {message: 'Incorrect Password'});
                    }
                });
            }
        })
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}