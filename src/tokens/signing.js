var crypto = require('crypto');
var _ = require('underscore');


exports.hashBody = function(body) {
    var encodedBody = encodeBody(body).join('\n');
    return _.isEmpty(encodedBody) ? '' : sanitizeBase64(md5Base64(encodedBody));
};

exports.signRequest = function(secret, bodyHash, request) {
    var hmac = crypto.createHmac('sha1', secret);
    var hash = hmac.update(encodeRequest(bodyHash, request)).digest('base64');
    return sanitizeBase64(hash);
};

function encodeRequest(bodyHash, request) {
    return _.flatten([
        request.method.toUpperCase(),
        encodeURIComponent(request.path.replace(/^\/+|\/+$/g, '')),
        encodeQuery(request.query),
        encodeURIComponent(bodyHash)
    ]).join('\n');
}

function encodeQuery(params) {
    return encodeKeys(_.map(params, function(pair) {
        return [pair[0], _.map(ensureArray(pair[1]), encodeURIComponent)]
    }));
}

function encodeKeys(params) {
    return _.chain(params)
        .map(function(pair) {
            return [encodeURIComponent(pair[0]), pair[1]]
        })
        .sortBy(_.first)
        .map(function(pair) {
            return _.flatten(_.map(pair[1], function(value) {
                return [pair[0], value];
            }))
        })
        .flatten()
        .value();
}

function encodeBody(body) {
    return encodeKeys(_.pairs(_.mapObject(body, function(param) {
        return _.map(ensureArray(param), md5Base64);
    })));
}

function md5Base64(value) {
    var md5 = crypto.createHash('md5');
    md5.update(value);
    return md5.digest('base64');
}

function sanitizeBase64(base64String) {
    return base64String.replace(/=/g, '').replace(/\//g, '-').replace(/\+/g, '_');
}

function ensureArray(value) {
    if(_.isArray(value)) {
        return value
    } else if(value) {
        return [value]
    } else {
        return []
    }
}
