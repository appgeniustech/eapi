'use strict';

/**
 * Module dependencies.
 */

var config = require('./config'),
_ = require('lodash'),
winston = require('winston'),
expressWinston = require('express-winston'),
azureLogger = require('winston-azuretable').AzureLogger;


// Set up logger
var customColors = {
    trace: 'white',
    debug: 'green',
    info: 'green',
    warn: 'yellow',
    crit: 'red',
    fatal: 'red'
};

var logger = new (winston.Logger)({
    colors: customColors,
    levels: {
        trace: 0,
        debug: 1,
        info: 2,
        warn: 3,
        crit: 4,
        fatal: 5
    },
    transports: [
    new (winston.transports.Console)({
        level: 'crit',
        colorize: false,
        timestamp: true,
        handleExceptions: true,
        exitOnError: false
    })
    // new (winston.transports.File)({ filename: 'somefile.log' })
    ]
});

logger.add(azureLogger, config.log.azure);

winston.addColors(customColors);

// Extend logger object to properly log 'Error' types
var origLog = logger.log;

logger.log = function (level, msg) {
    if (msg instanceof Error) {
        var args = Array.prototype.slice.call(arguments);
        args[1] = msg.stack;
        origLog.apply(logger, args);
    } else {
        origLog.apply(logger, arguments);
    }
};
/* LOGGER EXAMPLES
    app.logger.trace('testing');
    app.logger.debug('testing');
    app.logger.info('testing');
    app.logger.warn('testing');
    app.logger.crit('testing');
    app.logger.fatal('testing');
    */


module.exports = logger;


//init: function () {
//    winston.setLevels(winston.config.syslog.levels);
//    winston.loggers.add('nonetwork', {
//        console: {
//            level: 'error',
//            colorize: 'true',
//            label: 'No Network Category'
//        }
//    });
//    //winston.add(azureLogger, config.log.azure);
//    winston.exitOnError = false;
//    this.setUpAzureLogTable();
//},


//setUpAzureLogTable: function() {
//    var azure = require('azure-storage');
//    var a = config.log.azure;
//    var tableService = azure.createTableService(a.account, a.key);
//    tableService.createTableIfNotExists(a.tableName, function (error, result, response) {
//        if (error) {
//            // result contains true if created; false if already exists
//            winston.loggers.get('nonetwork').log('error', 'Failed to create azure table', error);
//        }
//    });
//}