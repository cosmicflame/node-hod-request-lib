var proxyquire = require('proxyquire');
var sinon = require('sinon');
var HodRequestLib = require('../');

describe('HoD Tokens', function() {
    var tokens = HodRequestLib.tokens;

    var token = {
        id: 'abc',
        type: 'UNB:SIMPLE',
        secret: 'xyz'
    };

    var request = {
        body: {
            bodyParam: 'paramVal'
        }
    };

    describe('stringFromToken', function () {
        it('should return a string', function () {
            tokens.stringFromToken(token).should.be.String();
        });

        it('should return the correct token', function () {
            tokens.stringFromToken(token).should.equal(token.type + ':' + token.id + ':' + token.secret);
        });
    });

    describe('stringForSignedRequest', function () {
        var signing = HodRequestLib.signing;
        var tokens;
        var bodyHash = 'bodyHash';
        var signature = 'signature';
        before(function() {
            sinon.stub(signing, 'hashBody');
            sinon.stub(signing, 'signRequest');
            signing.hashBody.withArgs(request.body).returns(bodyHash);
            signing.signRequest.withArgs(token.secret, bodyHash, request).returns(signature);

            tokens = proxyquire('../src/tokens/tokens', {
                signing: signing
            });
        });

        it('should return a string', function () {
            tokens.stringForSignedRequest(token, request).should.be.String();
        });

        it('should return the correct token', function () {
            tokens.stringForSignedRequest(token, request).should.equal(token.type + ':' + token.id + ':' + bodyHash + ':' + signature);
        });
    });
});
