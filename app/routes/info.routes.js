
module.exports = function (app) {
    // Profile Routes
    app.route('/info')
        .get(function (req, res) {
            var pkg = require('../../package.json');

            res.status(200).send('<h2>Version</h2> ' + pkg.version + ' <h2>Environment:</h2> ' + process.env.NODE_ENV + ' <h2>Port:</h2> ' + process.env.PORT);
    });

};