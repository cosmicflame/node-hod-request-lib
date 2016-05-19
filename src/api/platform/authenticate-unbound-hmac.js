var strings = require('../../../strings');
var HodRequest = require('../../models/hod-request');
var make = require('../../make-request');

module.exports = function (apikey, callback) {
    make(new HodRequest(this.config, null, {
        method: 'POST',
        type: strings.internal.apiTypes.platform,
        path: [
            'authenticate',
            'unbound'
        ],
        params: {
            token_type: strings.internal.tokenTypes.hmac,
            enable_sso: 'true'
        },
        headers: {
            apikey: apikey
        }
    }), this.config, null, callback);
};
