var signing = require('./signing');

var TOKEN_SEPARATOR = ':';

exports.stringFromToken = function(token) {
    return [
        token.type,
        token.id,
        token.secret
    ].join(TOKEN_SEPARATOR);
};

exports.stringForSignedRequest = function(token, request) {
    var bodyHash = signing.hashBody(request.body);
    var signature = signing.signRequest(token.secret, bodyHash, request);

    return [
        token.type,
        token.id,
        bodyHash,
        signature
    ].join(TOKEN_SEPARATOR)
};


