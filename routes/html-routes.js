var path = require("path");

module.exports = function(passport, app) {

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/location", IsAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/location.html"));
  });

  app.get("/register", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/register.html"));
  });

  app.get("/results", IsAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/results.html"));
  });

  app.get("/welcome", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/welcome.html"));
  });

  app.get("/error", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/errorPage.html"));
  });


  // -- Called in Welcome.html
  app.post('/login',
    passport.authenticate('local', { 
                                     successRedirect: '/location',
                                     failureRedirect: '/error'})
  );


  app.get("/logout", destroySession);


  // -- Passport functions
  function IsAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
      next();
    }
    else {
      res.redirect("/error");
    }
  }

  function destroySession(req, res, next) {
    req.logOut();
    req.session.destroy();
    res.redirect("/");
  }
};
