'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.controller'),
	User = mongoose.model('User'),
	_ = require('lodash');

exports.createFromFacebookProfile = function(profile, token, callback) {
    //this is where you might need to use the fpgraph module if profile doesn't have fields
    var user = new User();
    user.name = profile._json.first_name;
    user.dob = profile._json.birthday;
    user.location = profile._json.location ? profile._json.location.name : '';
    user.gender = profile.gender;
    user.email = profile._json.email;
    user.auth = 'facebook:' + profile.id;

    var httpreq = require('httpreq');
    httpreq.get('https://graph.facebook.com/v2.2/me/picture?access_token=' + token + '&redirect=1&height=200&type=large&width=200', { binary: true }, function (err, res) {
        if (err == null) {
            var prefix = "data:image/jpeg;base64,";
            var base64 = new Buffer(res.body, 'binary').toString('base64');
            user.picture = prefix + base64;
        }

        user.save(callback);
    });

};

exports.updateAuth = function (user, authType, authUserId, callback) {
    var auth = authType + ':' + authUserId;
    user.update({ 'auth': auth }, callback);
};

exports.getByAuth = function(authType, authUserId, callback) {
    var auth = authType + ':' + authUserId;
    User.findOne({ 'auth': auth }).exec(function(err, user) {
        if (err) callback(null);
        callback(user);
    });
};

exports.getByEmail = function (email, callback) {
    User.findOne({ 'email': email }).exec(function(err, user) {
        if (err) callback(null);
        callback(user);
    });
};

exports.current = function(req, res) {
    req.esession.populate('user',function (err, session) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(session.user);
        }
    });
};

exports.update = function(req, res) {
    req.esession.populate('user', function (err, session) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            //current user loaded, now update
            var user = _.extend(session.user, req.body);
            user.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(user);
                }
            });
        }
    });
};