'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Profile Schema
 */
var ProfileSchema = new Schema({

    description: {
        type: String,
        trim: true,
        default: ''
    },

    likes: String,

    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Profile', ProfileSchema);