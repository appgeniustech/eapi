/**
 * Module dependencies.
 */
var passport = require('passport'),
config = require('../config'),
    flash = require('connect-flash'),
    util = require('util'),
	sessions = require('../../app/controllers/sessions.controller');


function BadRequestError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'BadRequestError';
    this.message = message || null;
};

/**
 * Inherit from `Error`.
 */
BadRequestError.prototype.__proto__ = Error.prototype;


function Strategy(options, verify) {
    if (typeof options == 'function') {
        verify = options;
        options = {};
    }
    if (!verify) throw new Error('local authentication strategy requires a verify function');

    this._apiKeyField = options.apiKeyField || 'apikey';
    this._apiKeyHeader = options.apiKeyHeader || 'apikey';

    passport.Strategy.call(this);
    this.name = 'localapikey';
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function (req, options) {
    options = options || {};
    var apikey = req.headers[this._apiKeyHeader];

    if (!apikey) {
        return this.fail(new BadRequestError(options.badRequestMessage || 'Missing API Key'));
    }

    var self = this;

    function verified(err, user, info) {
        if (err) { return self.error(err); }
        if (!user) { return self.fail(info); }
        self.success(user, info);
    }

    if (self._passReqToCallback) {
        this._verify(req, apikey, verified);
    } else {
        this._verify(apikey, verified);
    }
}




module.exports = function () {

    passport.use(new Strategy({ apiKeyField: config.sessionToken.fieldName, passReqToCallback: config.sessionToken.passReqToCallback },
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