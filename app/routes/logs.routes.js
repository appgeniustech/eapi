var logs = require('../../app/controllers/logs.controller');

module.exports = function (app) {
    // Profile Routes
    app.route('/logs')
		.post(logs.log);

};