'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.controller'),
	Session = mongoose.model('Session'),
	_ = require('lodash');

exports.updateAuth = function (session, authType, authUserId, accessToken, callback) {
    session.update({ authToken: accessToken, auth: authType + ':' + authUserId }, callback);
};

exports.createForUser = function (user, accessToken, callback) {
    var session = new Session();
    session.authToken = accessToken;
    session.auth = user.auth;
    session.email = user.email;
    session.user = user;
    session.save(callback);
};

exports.getByAuth = function(authType, authUserId, callback) {
    Session.findOne({ auth: authType + ':' + authUserId }, function(err, session) {
        if (err) callback(null);
        callback(session);
    });
}

exports.getByEmail = function (email, callback) {
    Session.findOne({ 'email': email}, function (err, session) {
        if (err) callback(null);
        callback(session);
    });
}

exports.getById = function(id, callback) {
    Session.findById(id, callback);
};