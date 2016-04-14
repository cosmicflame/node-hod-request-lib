var strings = require('../../strings');
var HodRequest = require('../models/hod-request');
var make = require('../make-request');

module.exports = function(type) {
    return function (text, language, tokenProxy, callback) {
        var config = this.config;
        config.tokenRepository.get(tokenProxy, function(err, token) {
            make(new HodRequest(config, token, {
                type: type,
                method: 'POST',
                path: [
                    'analysis',
                    'sentiment'
                ],
                params: {
                    text: text,
                    language: language
                }
            }), config, tokenProxy, callback);
        });
    }
};
