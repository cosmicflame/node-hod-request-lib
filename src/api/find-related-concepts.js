var HodRequest = require('../models/hod-request');
var make = require('../make-request');

module.exports = function(type) {
    return function (index, opts, tokenProxy, callback) {
        var config = this.config;
        config.tokenRepository.get(tokenProxy, function(err, token) {
            make(new HodRequest(config, token, {
                type: type,
                path: [
                    'textindex',
                    'query',
                    'findrelatedconcepts'
                ],
                params: {
                    index: index,
                    text: opts.text || '*',
                    field_text: opts.fieldText || '',
                    sample_size: opts.sampleSize || 250,
                    max_results: opts.maxResults || 20
                }
            }), config, tokenProxy, callback);
        });
    }
};
