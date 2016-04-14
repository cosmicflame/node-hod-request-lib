var fs = require('fs');

var HodRequest = require('../models/hod-request');
var make = require('../make-request');

module.exports = function(type) {
    return function (file, tokenProxy, callback) {
        var config = this.config;
        config.tokenRepository.get(tokenProxy, function(err, token) {
            make(new HodRequest(config, token, {
                type: type,
                method: 'POST',
                path: [
                    'analysis',
                    'extractcontent'
                ],
                params: {
                    file: fs.createReadStream(file.path)
                }
            }), config, tokenProxy, callback);
        });
    };
};
