var strings = require('../../strings');
var HodRequest = require('../models/hod-request');
var make = require('../make-request');

module.exports = function(type) {
    return function (text, opts, tokenProxy, callback) {
        var config = this.config;
        config.tokenRepository.get(tokenProxy, function(err, token) {
            make(new HodRequest(config, token, {
                type: type,
                path: [
                    'textindex',
                    'query',
                    'search'
                ],
                params: {
                    text: text,
                    absolute_max_results: opts.maxResults,
                    field_text: opts.fieldText || '',
                    indexes: opts.indexes,
                    max_page_results: opts.maxPageResults,
                    print: opts.print || strings.queryPrintOptions.none,
                    print_fields: opts.printFields.join(',') || '',
                    start: opts.start || 1,
                    total_results: opts.totalResults || false
                }
            }), config, tokenProxy, callback);
        });
    };
};
