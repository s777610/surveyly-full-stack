const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport"); // tell passport to keep track user authentucation state
const bodyParser = require("body-parser");
const keys = require("./config/keys");
require("./models/User"); // define users model first
require("./services/passport"); // then use users model

mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true }
);

const app = express();

// cookieSession and Passport are middleware
// middleware modify incoming requests
// before they are sent to route handlers.

// bodyParser is middleware,
// any incoming requests' body will be assigned in req.body
app.use(bodyParser.json());

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
require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);

// production
if (process.env.NODE_ENV === "production") {
  //express will serve up production asset
  // like our main.js file, or main.css
  // if any get request comes in for some routes or some file,
  // but we do not understand what it's looking for(we do not already have a route handler).
  // look inside build directory and try to see if
  // there's some file inside of there that matches up with what this request is looking for.
  app.use(express.static("client/build"));

  //express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "built", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
