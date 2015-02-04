'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-localapikey').Strategy,
config = require('../config'),
    flash = require('connect-flash'),
	sessions = require('../../app/controllers/sessions.controller');

module.exports = function () {

    passport.use(new LocalStrategy({apiKeyField: config.sessionToken.fieldName, passReqToCallback: config.sessionToken.passReqToCallback},
      function (req, sessionId, done) {
              // set the user to `false` to
              // indicate failure and set a flash message.  Otherwise, return the
          // authenticated `session`.
          sessions.getById(sessionId, function(err, session) {
              if (err) { return done(err); }
              if (!session) { return done(null, false, { message: 'Unknown session : ' + sessionId }); }
              return done(null, session);
          });
  }
));


};