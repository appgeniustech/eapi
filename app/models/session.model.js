'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var getExpiration = function () {
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
};

/**
 * Session Schema
 */
var SessionSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    email: {
        type: String,
        unique: 'Email already exists in sessions'
    },

    auth: {
        type: String,
        required: 'Auth is required. type:id'
    },

    authToken: {
        type: String,
        required: 'Must set the auth token'
    },

    expires: {
        type: Date,
        default: getExpiration
    },

    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * has session expired
 */
SessionSchema.virtual('expired').get(function () {
    return this.expires > Date.now();
});

mongoose.model('Session', SessionSchema);