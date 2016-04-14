var HodRequest = require('../models/hod-request');
var make = require('../make-request');

module.exports = function(type) {
    return function (index, json, tokenProxy, callback) {
        var config = this.config;
        config.tokenRepository.get(tokenProxy, function(err, token) {
            make(new HodRequest(config, token, {
                method: 'POST',
                type: type,
                path: [
                    'textindex',
                    index,
                    'document'
                ],
                params: {
                    json: json
                }
            }), config, tokenProxy, callback);
        });
    }
};
