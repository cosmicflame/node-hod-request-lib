var HodRequest = require('../models/hod-request');
var make = require('../make-request');

module.exports = function(type) {
    return function (name, flavor, fields, tokenProxy, callback) {
        var config = this.config;
        config.tokenRepository.get(tokenProxy, function(err, token) {
            make(new HodRequest(config, token, {
                apiVersion: 'v2',
                method: 'POST',
                type: type,
                path: [
                    'textindex',
                    name
                ],
                params: {
                    flavor: flavor,
                    flavor_parameters: JSON.stringify({
                        parametric_fields: fields && fields.parametric_fields || [],
                        numeric_fields: fields && fields.numeric_fields || [],
                        index_fields: fields && fields.index_fields || []
                    })
                }
            }), config, tokenProxy, callback);
        });
    };
};
