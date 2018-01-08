var db = require("../models");

module.exports = function(app) {

	app.get("/api/users", function(req, res) {
		db.Users.findAll({}).then(function(dbPost) {
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

	app.get("/api/users/:id", function(req, res) {
		db.Users.findOne({
			where: {
				id: req.params.id
			}
		}).then(function(dbPost) {
			res.json(dbPost);
		});
	});

	app.post("/api/users", function(req, res) {
		db.Users.create(req.body).then(function(dbPost) {
			res.json(dbPost);
		});
	});

	// PUT route for updating posts
	app.put("/api/users", function(req, res) {
		db.Users.update(
			req.body,
			{
				where: {
					id: req.body.id
				}
			}
		).then(function(dbPost) {
			res.json(dbPost);
		});
	});
};