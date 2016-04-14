var proxyquire = require('proxyquire');
var sinon = require('sinon');
var should = require('should');

var tokenRepository = new (require('../').SimpleTokenRepository)();

var mockRequest = {
    method: 'GET',
    headers: {
        header: 'one'
    },
    formData: {
        data: 'two'
    },
    getUrl: function () {
        return 'https://something.com'
    }
};

var token = {
    type: 'CMB',
    id: 'abc',
    secret: '123'
};

var config = {
    tokenRepository: tokenRepository
};

describe('HoD make-request', function() {
    var request;
    var makeRequest;

    before(function () {
        sinon.stub(tokenRepository, 'get').returns(token);
        sinon.stub(tokenRepository, 'update').yields(null, 'tokenProxy');
        request = sinon.stub().yields(null, {}, {});
        makeRequest = proxyquire('../src/make-request', {
            request: request
        });
    });

    after(function() {
        tokenRepository.get.restore();
        tokenRepository.update.restore();
    });

    it('should call request with the correct options', function(done) {
        makeRequest(mockRequest, config, 'tokenProxy', function() {
            request.calledOnce.should.be.true();
            request.args[0][0].method.should.equal('GET');
            request.args[0][0].url.should.equal('https://something.com');
            request.args[0][0].headers.header.should.equal('one');
            request.args[0][0].formData.data.should.equal('two');
            done();
        });
    });

    describe('successful request', function () {
        before(function () {
            request = sinon.stub().yields(null, {
                statusCode: 200,
                headers: {
                    refresh_token: JSON.stringify(token)
                }
            }, '{ "answer": 42 }');
            makeRequest = proxyquire('../src/make-request', {
                request: request
            });
        });

        it('should yield the response and no error', function (done) {
            makeRequest(mockRequest, config, 'tokenProxy', function (err, res) {
                should.exist(res.result);
                res.result.answer.should.equal(42);
                done();
            });
        });

        it('should call update on the token repository if given a response containing a refresh token header', function (done) {
            tokenRepository.update.reset();
            makeRequest(mockRequest, config, 'tokenProxy', function () {
                tokenRepository.update.calledOnce.should.be.true();
                tokenRepository.update.args[0][0].should.equal('tokenProxy');
                tokenRepository.update.args[0][1].should.deepEqual(token);
                done();
            });
        });
    });

    describe('unsuccessful request', function () {
        before(function () {
            request = sinon.stub().yields(new Error('an error'), {
                statusCode: 500
            }, '{ "error": { "error": 8000, "reason": "because" }');
            makeRequest = proxyquire('../src/make-request', {
                request: request
            });
        });

        it('should yield an error', function (done) {
            makeRequest(mockRequest, config, 'tokenProxy', function(err) {
                should.exist(err);
                done();
            });
        });
    });
});
