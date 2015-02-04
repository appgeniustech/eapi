'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	config = require('./config'),
    passport = require('passport'),
	    sessions = require('../app/controllers/sessions.controller');

/**
 * Module init function.
 */
module.exports = function (app) {
    // Initialize strategies
    config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategy) {
        require(path.resolve(strategy))();
    });

    app.use(function (req, res, next) {
        if (req.url === '/logs' && req.method === 'POST')
            return next();
        var sessionId = req.headers[config.sessionToken.apiKeyHeader];
        if (sessionId) {
            sessions.getById(sessionId, function(err, session) {
                if (err) {
                    return next(err);
                }
                if (!session) {
                    return next('Unknown session with id : ' + sessionId);
                }
                req.esession = session;
                return next();
            });
        } else {
            passport.authenticate(['facebook-token'], { failureFlash: true, session: false }, function(err, session, info) {
                if (err) {
                    return next(err);
                }
                if (!session) {
                    return res.send(401);
                }
                req.esession = session;
                res.setHeader("x-session", session.id);
                return next();
            })(req, res, next);
        }
    });
};