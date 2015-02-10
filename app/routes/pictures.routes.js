'use strict';
var pictures = require('../../app/controllers/pictures.controller');

module.exports = function (app) {
    // Friend Routes

    app.route('/pictures/:id')
        .put(pictures.update)
		.post(pictures.delete);

    // Pictures middleware
    app.param('id', pictures.userById);
};

