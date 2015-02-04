'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    Profile = mongoose.model('Profile');

/**
 * A Validation function for local  properties
 */
var validateProperty = function (property) {
    return true; //((this.authType !== 'local' && !this.updated) || property.length);
};

var validateAge = function(age) {
    return age >= 18;
};

var setDob = function (birthday) {
    if (!validateAge(this.age)) {
        if (birthday == null)
            return '';
        var bdDate = new Date(birthday);

        var ageDifMs = Date.now() - bdDate.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return birthday;
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: '',
        validate: [validateProperty, 'Please fill in your name']
    },

    status: {
        type: {
            type: String,
            enum: ['', 'registered', 'approved']
        },
        default: ''
    },

    email: {
        type: String,
        unique: 'Email already exists',
        trim: true,
        required: 'Please fill in an email address',
        default: '',
        validate: [validateProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },

    age: {
        type: Number,
        default: 0,
        validate: [validateAge, 'You must be greater than 18 to join']
    },

    dob: {
        type: Date,
        set: setDob
    },

    gender: String,

    location: {
        type: String,
        trim: true,
        default: ''
    },

    description: {
        type: String,
        trim: true,
        default: ''
    },

    picture: String,

    profile: [Profile.schema],
   
    auth: {
        type: String,
        trim: true
    },
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user']
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});



mongoose.model('User', UserSchema);