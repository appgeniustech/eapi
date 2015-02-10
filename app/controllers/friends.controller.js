'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.controller'),
	User = mongoose.model('User'),
	Profile = mongoose.model('Profile'),
	_ = require('lodash'),
    config = require('../../config/config'),
    httpreq = require('httpreq');

exports.newFriend = function (req, res) {
	var user = new User();
	user.profile = new Profile();

    res.json(user);
};

exports.create = function (req, res) {
	if (req.body.profile == null)
		return res.status(400).send({
			message: "Profile must not be null"
		});
    var friend = new User(req.body);
    friend.status = 'registered';
    friend.profile[0].createdBy = req.esession.user;
    friend.save(function(err) {
    	if (err) {
    		return res.status(400).send({
    			message: errorHandler.getErrorMessage(err)
    		});
    	} else {
    		res.json(friend);
    	}
    });

};

exports.delete = function(req, res) {
	var friend = req.friend;
    var currentUser = req.esession.user;

    if (!currentUser.id === friend.profile[0].createdBy._id.id)
    	return res.status(400).send({
    		message: 'Can no delete a friend you did not create'
    	});

    if (friend._id.equals(currentUser))
    	return res.status(400).send({
    		message: 'Can no delete your self'
    	});

    if (friend.pictures && friend.pictures.length > 0) {
        httpreq.delete(config.agStorage.url + friend.id + '/multi', {
            json: friend.pictures
        }, function(err) {
            if (err)
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            friend.remove(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json({});
                }
            });
        });

    } else {
        friend.remove(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json({});
            }
        });
    }
};

exports.update = function (req, res) {

    if (req.body.profile == null)
        return res.status(400).send({
            message: 'Profile must not be null'
        });


    var friend = req.friend;
    friend.name = req.body.name;
    friend.age = req.body.age;
    friend.location = req.body.location;
    friend.gender = req.body.gender;
    friend.email = req.body.email;
    friend.status = 'registered';
    friend.profile[0].description = req.body.profile[0].description;
    friend.profile[0].likes = req.body.profile[0].likes;

	var currentUser = req.esession.user;
	if (!friend.profile[0].createdBy._id.id === currentUser.id)
		return res.status(400).send({
			message: 'Can not update a friend you did not create'
		});
	
	friend.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(friend);
		}
	});
};

/**
 * List of Friends
 */
exports.list = function (req, res) {
    User.find({ 'status': 'registered' }).populate({ path: 'profile.createdBy' }).sort('-created').lean().exec(function (err, friends) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(friends);
		}
	});
};

/**
 * Friend middleware
 */
exports.friendById = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Friend id is invalid'
		});
	}

	User.findById(id).populate({path: 'profile.createdBy'}).exec(function (err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.friend = user;
		next();
	});
};