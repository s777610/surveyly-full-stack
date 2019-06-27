const passport = require("passport");

module.exports = app => {
  // whenever users visit this endpoint, should be directed to authentication flow.
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      // specifying the 'google' strategy, to authenticate requests.
      scope: ["profile", "email"]
    })
  );

  // users get sent back to our application with code, the callback func of GoogleStrategy will run
  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/surveys");
    }
  );

  // logout() is a func attached to request obj by passport
  app.get("/api/logout", (req, res) => {
    req.logout(); // take a cookie, contain user id, and kill the user id
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user); // return a user who send the request
  });
};
