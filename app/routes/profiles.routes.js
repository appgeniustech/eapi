var profiles = require('../../app/controllers/profiles.controller');

module.exports = function (app) {
	// Profile Routes
	app.route('/profiles')
		.get(profiles.list);

};