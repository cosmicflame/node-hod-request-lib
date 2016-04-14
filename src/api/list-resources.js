var HodRequest = require('../models/hod-request');
var make = require('../make-request');

module.exports = function(type) {
    return function (opts, tokenProxy, callback) {
        var config = this.config;
        config.tokenRepository.get(tokenProxy, function(err, token) {
            make(new HodRequest(config, token, {
                type: type,
                path: [
                    'resource'
                ],
                params: {
                    flavor: opts.flavor || null,
                    type: opts.type || null
                }
            }), config, tokenProxy, callback);
        });
    }
};
