const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport'); // tell passport to keep track user authentucation state
const keys = require('./config/keys');
require('./models/User'); // define users model first
require('./services/passport'); // then use users model

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

// cookieSession and Passport are middleware 
// middleware modify incoming requests 
// before they are sent to route handlers.

// cookieSession extract cookie data(token) from cookie and assign it to req.session
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
// passport look for user.id(token) from req.session, then go deserializeUser
app.use(passport.initialize());
app.use(passport.session());

// when we require authRoutes file, it returns a func which take app as arg
require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000
app.listen(PORT);