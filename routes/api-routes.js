var db = require("../models");

module.exports = function(app) {
	// -- POST resquest in register.js to add new users
	app.post("/api/users", function(req, res) {
		db.Users.findOne({ where: { username: req.body.username } }).then(function(user) {
			console.log(user);
			if(!user) {
				db.Users.create(req.body).then(function(dbPost) {
					res.json(dbPost);
				});
			}
			else {
				res.send(false);
			}
		});
	});



	// -- PUT requests for location.js to update Active Location
	app.put("/api/users/home", function(req, res) {
		db.Users.update(
			{ activeLocation: req.user.homeAddress },
			{ where: { id: req.user.id } }
		).then(function(dbPost) {
			res.json(dbPost);
		});
	});

	app.put("/api/users/update", function(req, res) {
		db.Users.update(
			{ homeAddress: req.body.homeAddress, activeLocation: req.body.homeAddress },
			{ where: { id: req.user.id } }
		).then(function(dbPost) {
			res.json(dbPost);
		});
	});

	app.put("/api/users/currentOrCustom", function(req, res) {
		db.Users.update(
			{ activeLocation: req.body.activeLocation },
			{ where: { id: req.user.id } }
		).then(function(dbPost) {
			res.json(dbPost);
		});
	});



	// -- API routes for results.js to display results
	app.get("/api/thisUser", function(req, res) {
		db.Users.update(
			{ online: 1 },
			{ where: { id: req.user.id } }
		).then(function(dbResponse) {
			db.Users.findOne(
				{ where: { id: req.user.id } }
			).then(function(dbPost) {
				res.json(dbPost);
			});
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
			{ online: 0 },
			{ where: { id: req.user.id } }
		).then(function(dbPost) {
			res.json(dbPost);
		});
	});
};