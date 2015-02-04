'use strict';
var logger = require('../../config/logger');

exports.log = function (req, res) {
    if(req.body.metadata)
        logger.log(req.body.type, req.body.message, req.body.metadata);
    else logger.log(req.body.type, req.body.message);

    res.json({});
};
