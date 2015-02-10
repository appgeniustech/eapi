'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
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
        if (req.url === '/logs' && (req.method === 'POST' || req.method === 'GET'))
            return next();
        if (req.url === '/info') return next();
        var apikey = req.headers["apikey"];
        if (apikey && apikey === 'ApiRestKey+all')
            return next();

        var sessionId = req.headers[config.sessionToken.apiKeyHeader];
        if (sessionId) {
            if (!mongoose.Types.ObjectId.isValid(sessionId)) {

                res.status(400);
                return next(new Error('Invalid session id of ' + sessionId));
            }
            sessions.getById(sessionId, function(err, session) {
                if (err) {
                    return next(err);
                }
                if (!session) {
                    return next(new Error('Unknown session with id : ' + sessionId));
                }
                res.setHeader("x-session", session.id);
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