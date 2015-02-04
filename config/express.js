'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    config = require('./config'),
    path = require('path'),
    logger = require('./logger');


module.exports = function() {
    // Initialize express app
    var app = express();



    // Globbing model files
    config.getGlobbedFiles('./app/models/**/*.js').forEach(function (modelPath) {
        require(path.resolve(modelPath));
    });
    
    // Showing stack errors
    app.set('showStackError', true);

    //body parsing
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '50mb'
    }));
    app.use(bodyParser.json({ limit: '50mb' }));

    app.disable('x-powered-by');

    // Setting the app router and static folder
    app.use(express.static(path.resolve('./public')));

    app.use(passport.initialize());

    // Bootstrap passport config
    require('./passport')(app);

    //app.use(expressWinston.logger({
    //    transports: [
    //      new winston.transports.Console({
    //          json: true,
    //          colorize: true,
    //          level: 'info',
    //          meta: true,
    //          expressFormat: false
    //      })
    //    ]
    //}));

    // Globbing routing files
    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });

    //var elogger = expressWinston.errorLogger({
    //    transports: [
    //        new winston.transports.Console({
    //            json: true,
    //            colorize: true
    //        })
    //    ]
    //});
    //elogger.add(azureLogger, config.log.azure);
    //app.use(elogger);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found - 404');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            logger.warn('Exressjs error: ' + err.message, err);
            res.status(err.status || 500);
            res.send(err.message + ' : ' + err.stack);
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send(err.message + ' : ' + err.stack);
    });


    return app;

};