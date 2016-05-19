var strings = require('../../../strings');
var HodRequest = require('../../models/hod-request');
var make = require('../../make-request');

module.exports = function (token, callback) {
    make(new HodRequest(this.config, null, {
        type: strings.internal.apiTypes.platform,
        path: [
            'authenticate'
        ],
        headers: {
            token: token
        },
        retry: false
    }), this.config, null, callback);
};
