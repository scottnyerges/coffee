var path = require("path");

module.exports = function(app) {

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/location/:id", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/location.html"));
  });

  app.get("/register", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/register.html"));
  });

  app.get("/results/:id", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/results.html"));
  });

  app.get("/welcome", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/welcome.html"));
  });
};
