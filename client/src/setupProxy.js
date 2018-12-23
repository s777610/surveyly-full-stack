const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  // if anyone try to vist /auth/google on client server,
  // forward that request to express server http://localhost:5000/auth/google
  app.use(proxy("/auth/google", { target: "http://localhost:5000" }));
  app.use(proxy("/api/surveys/", { target: "http://localhost:5000" }));
  app.use(proxy("/api/*", { target: "http://localhost:5000" }));
};
