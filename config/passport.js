'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	config = require('./config'),
    passport = require('passport');

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
        passport.authenticate(['localapikey','facebook-token'], { failureFlash: true, session: false }, function (err, session, info) {
            if (err) { return next(err); }
            if (!session) { return res.send(401); }
            req.esession = session;
            res.setHeader("X-Session", session.id);
            return next();
        })(req, res, next);
    });
};