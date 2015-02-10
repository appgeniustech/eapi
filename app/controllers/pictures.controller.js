'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.controller'),
    User = mongoose.model('User');

exports.delete = function (req, res) {
    var url = req.body.imgUrl;
    if (url == null || url.length < 10 || !req.puser.pictures || req.puser.pictures.length < 1)
        return res.json({});
    //ignore unknown pictures and default 
    if (req.puser.pictures.indexOf(url) < 1)
        return res.json({});

    User.update({ _id: req.puser.id }, { $pull: { pictures: url } },
        function (err) {
    	if (err) {
    		return res.status(400).send({
    			message: errorHandler.getErrorMessage(err)
    		});
    	} else {
	        res.json({});
	    }
    });
};

exports.update = function(req, res) {
    var updatedPicture = req.body;
    if (req.puser.pictures && req.puser.pictures.indexOf(updatedPicture.imgUrl) >= 0)
        return res.json({});

    if (!req.puser.pictures) {
        req.puser.pictures = [];
        req.puser.pictures.push(updatedPicture.imgUrl);
        if (updatedPicture.thumbnail)
            req.puser.picture = updatedPicture.thumbnail;
    } else {
        if (updatedPicture.thumbnail) {
            req.puser.picture = updatedPicture.thumbnail;
            req.puser.pictures.unshift(updatedPicture.imgUrl);
        } else {
            req.puser.pictures.push(updatedPicture.imgUrl);
        }
    }

    req.puser.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json({});
            }
        });
};

/**
 * Pictures middleware
 */
exports.userById = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'User id is invalid'
		});
	}

	User.findById(id).exec(function (err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.puser = user;
		next();
	});
};