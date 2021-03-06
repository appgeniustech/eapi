﻿/**
 * Module dependencies.
 */

var app = require('./app');
var http = require('http');
var config = require('./config/config');
var logger = require('./config/logger');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '1337');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        logger.log('fatal', 'Error at http server level', error);
        throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.log('crit', bind + ' requires elevated privileges', error);
            process.exit(1);

            break;
        case 'EADDRINUSE':
            logger.log('crit', bind + ' is already in use', error);
            break;
        default:
            logger.log('crit', 'default error in binwww', error);
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    // Logging initialization
    logger.log('info', config.app.title + ' application started');
    logger.log('info', 'AgStorage URL: ' + config.agStorage.url);
    logger.log('info', 'Environment: ' + process.env.NODE_ENV);
    logger.log('info', 'Listening on: ' + bind);
    logger.log('info', 'Database: ' + config.db.uri);
}
