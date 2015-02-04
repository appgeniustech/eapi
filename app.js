var config = require('./config/config'),
 logger = require('./config/logger'),
    mongoose = require('mongoose');


/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */


// Bootstrap db connection
var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
    if (err) {
        logger.crit('error connecting to mongodb', err);
    }
});
mongoose.connection.on('error', function (err) {
    logger.crit('mongoose connection error', err);

    }
);

// Init the express application
var app = require('./config/express')();



// Expose app
exports = module.exports = app;
