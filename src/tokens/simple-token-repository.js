var uuid = require('node-uuid');


module.exports = SimpleTokenRepository;

function SimpleTokenRepository () {
    this.tokenMap = {};
}

SimpleTokenRepository.prototype.insert = function (token, callback) {
    var tokenProxy = uuid.v4();
    return update.call(this, tokenProxy, token, callback);
};

SimpleTokenRepository.prototype.update = update;

SimpleTokenRepository.prototype.get = function (tokenProxy, callback) {
    return callback(null, this.tokenMap[tokenProxy]);
};

SimpleTokenRepository.prototype.remove = function (tokenProxy, callback) {
    return callback(null, delete this.tokenMap[tokenProxy]);
};

function update(tokenProxy, token, callback) {
    if(tokenExpired(token)) {
        return callback(new Error('Token has already expired.'), null);
    }

    this.tokenMap[tokenProxy] = token;
    return callback(null, tokenProxy);
}

function tokenExpired(token) {
    return token.expiry && token.expiry <= (new Date()).getTime();
}
