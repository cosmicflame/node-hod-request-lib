var url = require('url');
var qs = require('querystring');
var _ = require('underscore');

var strings = require('../../strings');
var toTokenString = require('../tokens').tokens.stringFromToken;


module.exports = HodRequest;

function HodRequest(config, token, opts) {
    this.method = 'GET';
    this.type = strings.internal.apiTypes.sync;
    this.params = {};
    this.headers = {};
    this.formData = {};
    this.path = [];
    this.apiVersion = 'v1';
    this.majorVersion = '2';

    _.extend(this, opts);
    this.config = config;

    if(token) {
        if(this.method === 'GET') {
            this.params.token = toTokenString(token);
        } else {
            this.headers.token = toTokenString(token);
        }
    }

    if(this.method !== 'GET') {
        this.formData = this.params;
    }
}

HodRequest.prototype.getUrl = function () {
    return url.format({
        protocol: this.config.hodProtocol,
        host: this.config.hodApiHost,
        pathname: this.getPath(),
        search: this.method === 'GET' ? qs.stringify(this.params) : ''
    });
};

HodRequest.prototype.getPath = function () {
    if (this.type === strings.internal.apiTypes.sync || this.type === strings.internal.apiTypes.async) {
        return [
            this.majorVersion,
            'api',
            this.type
        ]
            .concat(this.path)
            .concat([this.apiVersion])
            .join('/');
    } else {
        return [
            this.majorVersion
        ].concat(this.path)
            .join('/');
    }
};
