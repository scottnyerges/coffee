var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var passportConfig = require("./config/passport.js")(passport);
var flash = require("connect-flash");

var app = express();
var PORT = process.env.PORT || 3010;

var db = require("./models");

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(session({ secret: "goatjsformakingbettersecurity"}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));

require("./routes/html-routes.js")(passport, app);
require("./routes/api-routes.js")(app);


db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  db.Users.findOne({ where: {username: "admin"}}).then(function (user) {
  	if (!user) {
  		db.Users.build({ username: "admin", password: "admin", homeAddress: "7405 Sevilla Dr Austin TX"}).save();
  	}
  })
});
