var logs = require('../../app/controllers/logs.controller');

module.exports = function (app) {
    // Profile Routes
    app.route('/logs')
        .get(logs.list)
        .post(logs.log);

};