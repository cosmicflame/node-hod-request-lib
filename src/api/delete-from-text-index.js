var HodRequest = require('../models/hod-request');
var make = require('../make-request');

module.exports = function(type) {
    return function (index, allDocs, tokenProxy, callback) {
        var config = this.config;
        config.tokenRepository.get(tokenProxy, function(err, token) {
            make(new HodRequest(config, token, {
                method: 'DELETE',
                type: type,
                path: [
                    'textindex',
                    index,
                    'document'
                ],
                params: {
                    delete_all_documents: allDocs.toString()
                }
            }), config, tokenProxy, callback);
        });
    }
};
