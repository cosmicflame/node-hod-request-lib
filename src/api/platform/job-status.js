var strings = require('../../../strings');
var HodRequest = require('../../models/hod-request');
var make = require('../../make-request');

module.exports = function (jobId, tokenProxy, callback) {
    var config = this.config;
    config.tokenRepository.get(tokenProxy, function(err, token) {
        make(new HodRequest(config, token, {
            type: strings.apiTypes.platform,
            path: [
                'job',
                jobId,
                'status'
            ]
        }), config, tokenProxy, callback);
    });
};
