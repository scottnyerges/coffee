var db = require("../models");

module.exports = function(app) {
	// -- POST resquest in register.js to add new users
	app.post("/api/users", function(req, res) {
		db.Users.findOne({ where: { username: req.username } }).then(function(user) {
			if(!user) {
				db.Users.create(req.body).then(function(dbPost) {
					res.json(dbPost);
				});
			}
			else {
				res.redirect("/register");
			}
		});
	});



	// -- PUT requests for location.js to update Active Location
	app.put("/api/users/home", function(req, res) {
		db.Users.update(
			{ online: 1, activeLocation: req.user.homeAddress },
			{ where: { id: req.user.id } }
		).then(function(dbPost) {
			res.json(dbPost);
		});
	});

	app.put("/api/users/update", function(req, res) {
		db.Users.update(
			{ online: 1, homeAddress: req.body.homeAddress, activeLocation: req.body.homeAddress },
			{ where: { id: req.user.id } }
		).then(function(dbPost) {
			res.json(dbPost);
		});
	});

	app.put("/api/users/currentOrCustom", function(req, res) {
		db.Users.update(
			{ online: 1, activeLocation: req.body.activeLocation },
			{ where: { id: req.user.id } }
		).then(function(dbPost) {
			res.json(dbPost);
		});
	});



	// -- API routes for results.js to display results
	app.get("/api/thisUser", function(req, res) {
		db.Users.findOne(
			{ where: { id: req.user.id } }
		).then(function(dbPost) {
			res.json(dbPost);
		});
	});

	app.get("/api/users/online", function(req, res) {
		db.Users.findAll({
			where: {
				online: true
			}
		}).then(function(dbPost) {
			res.json(dbPost);
		});
	});

	app.put("/api/users/logout", function(req, res) {
		db.Users.update(
			{ online: 0, activeLocation: null },
			{ where: { id: req.user.id } }
		).then(function(dbPost) {
			res.json("dbPost");
		});
	});
};