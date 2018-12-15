const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');


// one arg mean we try to fetch something from mongoose
// two arg mean we try to put something into mongoose
const User = mongoose.model('users');


// user is we just a instance pull out from db or create 2s ago
// turn user model to token(user.id) and put in cookie
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// turn (token)id into mongoose user instance
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

// to allows passport use google strategy
passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id })
        .then((existingUser) => {
            if (existingUser) {
                done(null, existingUser); // null is not error
            } else {
                // create new instance of user and save it into db
                new User({ googleId: profile.id }).save() // this is async 
                .then(user => done(null, user)); // tell password we are done
            }
        });
    })
);