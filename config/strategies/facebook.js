'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    FacebookTokenStrategy = require('passport-facebook-token').Strategy,
    config = require('../config'),
    flash = require('connect-flash'),
	users = require('../../app/controllers/users.controller'),
	sessions = require('../../app/controllers/sessions.controller');

module.exports = function () {
    //sending tokens requirements:
    //accessToken = accessToken || req.query.access_token || req.headers.access_token;
    //refreshToken = refreshToken || req.query.refresh_token || req.headers.refresh_token;

    passport.use(new FacebookTokenStrategy(config.facebook,
  function (req, accessToken, refreshToken, profile, done) {

      //{ facebookId: profile.id },
      sessions.getByEmail(profile._json.email, function (session) {
          
          if (session) {
              sessions.updateAuth(session, 'facebook', profile.id, accessToken, function(err) {
                  return done(null, session);
              });

          } else {
              users.getByEmail(profile._json.email, function (user) {
                  if (user) {
                      users.updateAuth(user, 'facebook', profile.id, function(err) {
                          if (err) return done(err, null);
                          else {
                              sessions.getByEmail(user.email, function (session) {
                                  if (session)
                                      return done(null, session);
                                  else {
                                       sessions.createForUser(user, accessToken, function(err, session) {
                                          if (err) return done(err);
                                          if (session == null) return done('Could not create session for user.');
                                          return done(null, session);
                                      });
                                  }
                              });
                              
                          }
                      });
                      
                  } else {
                      users.createFromFacebookProfile(profile, accessToken, function (err, user) {
                          if (err) return done(err);
                          if (user == null) return done('Could not create a user using facebook profile');

                          sessions.createForUser(user, accessToken, function (err, session) {
                              if (err) return done(err);
                              if (session == null) return done('Could not create session for user.');
                              return done(null, session);
                          });
                      });
                  }
              });
          }


      });

  }
));

};