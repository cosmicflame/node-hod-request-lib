var async = require('async');
var _ = require('underscore');
var request = require('request');

var debug = require('./services/debug');
var HodResponse = require('./models/hod-response');
var strings = require('../strings');

module.exports = function make(hodRequest, config, tokenProxy, callback) {
    var query = hodRequest.getUrl();
    debug.log('Sending ' + hodRequest.method + ' request to ' + query);

    var opts = {
        method: hodRequest.method,
        url: query,
        encoding: 'utf8',
        timeout: config.requestTimeout,
        headers: hodRequest.headers,
        formData: hodRequest.formData
    };

    request(opts, function (err, resp, body) {
        var statusCode = resp && resp.statusCode;
        var hodResponse = new HodResponse(body, statusCode);

        async.parallel([
            _.partial(checkRefresh, resp, tokenProxy, config.tokenRepository),
            _.partial(checkError, err, hodResponse, statusCode)
        ], function(err) {
            if(err) return callback(err, hodResponse);
            return callback(null, hodResponse);
        });
    });
};

function checkRefresh(resp, tokenProxy, tokenRepository, callback) {

    if(tokenProxy && resp && resp.headers && resp.headers.refresh_token) {
        try {
            var refreshToken = JSON.parse(resp.headers.refresh_token);
            return tokenRepository.update(tokenProxy, refreshToken, callback);
        } catch(e) {
            var message = 'Invalid JSON returned in refresh_token header from HoD';
            debug.error(message);
            return callback(new Error(message));
        }
    }

    return callback(null);
}

function checkError(err, hodResponse, statusCode, callback) {

    if (err || _.contains(strings.internal.incompleteJobStatusCodes, statusCode) || hodResponse.error) {
        var errorMessageDetail = err || hodResponse.error || '';
        var errorMessage = 'HoD request ' + (hodResponse.jobId || '') + ' was unsuccessful or has thrown error. ' + errorMessageDetail;

        debug.error(errorMessage);
        return callback(new Error(errorMessage));
    }

    return callback(null);
}
