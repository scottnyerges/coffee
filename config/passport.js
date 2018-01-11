var db = require("../models");

module.exports = function(passport) {
  var LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.Users.findOne({ where: { id: id } }).then(function(user) {
      done(null, user);
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      db.Users.findOne({ where: { username: username } }).then(function(user) {
        if (!user) {
          done(null, false, { message: 'Incorrect username.' });
        }
        else {
          db.Users.validatePassword(password, user.password, done, user); 
        }
      });
    }
  ));
}
  