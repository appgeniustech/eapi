'use strict';
var friends = require('../../app/controllers/friends.controller');

module.exports = function (app) {
    // Friend Routes
    app.route('/friends')
		.get(friends.list)
		.post(friends.create);

    app.route('/friends/:id')
        .put(friends.update)
		.delete(friends.delete);

    app.route('/friends/new')
        .get(friends.newFriend);

    // Friends middleware
    app.param('id', friends.friendById);
};

