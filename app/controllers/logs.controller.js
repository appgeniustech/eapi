'use strict';
var logger = require('../../config/logger'),
    config = require('../../config/config'),
azure = require('azure-storage');

exports.log = function (req, res) {
    if(req.body.metadata)
        logger.log(req.body.type, req.body.message, req.body.metadata);
    else logger.log(req.body.type, req.body.message);

    res.json({});
};

exports.list = function (req, res, next) {
    var ts = azure.createTableService(config.log.azure.account, config.log.azure.key);

    ts.createTableIfNotExists(config.log.azure.tableName, function (err) {
        if (err) {
            return next(err);
        }

        var DATE_MAX = new Date(3000, 1);
        var host = require('os').hostname().toString();
        var d = new Date();
        var fromTime = new Date();
        fromTime.setHours(d.getHours() - 2);
        
        var query = new azure.TableQuery()
                .where('hostname eq ?', host)
                .and('RowKey le ?', (DATE_MAX - fromTime).toString())
                .top(50);

        ts.queryEntities(config.log.azure.tableName, query, null, function (queryError, queryResult, queryResponse) {
            if (queryError) {
                return next(queryError);
            }

            var entityResult = [],
                entities = queryResult.entries;

            for (var i = 0; i < entities.length; i++) {
                var entity = {msg: '', props: ''};
                for (var key in entities[i]) {
                    if (key === '.metadata') {
                        continue;
                    }
                    if (key == 'msg')
                        entity.msg = entities[i][key]._;
                    else entity.props = entity.props + ' | ' + entities[i][key]._;
                }

                entityResult.push(entity);
            }
                entityResult = entityResult.reverse();

                res.json(entityResult);

        });

    });

};
