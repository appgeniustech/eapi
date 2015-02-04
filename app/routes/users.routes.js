var users = require('../../app/controllers/users.controller');

module.exports = function (app) {
    // User Routes
    app.route('/users')
		.get(users.current)
		.put(users.update);

};