var sinon = require('sinon');
var should = require('should');

var HodRequest = require('../src/models/hod-request');
var strings = require('../strings');

var config = {
    hodProtocol: 'https',
    hodApiHost: 'api.havenondemand.com'
};

var params = {
    param: 'one'
};


describe('HoD Request Model', function() {
    var hodRequest;

    describe('constructor', function () {
        it('should overwrite defaults with the passed in opts, except for config', function () {
            hodRequest = new HodRequest(config, 'token', {
                method: 'POST',
                apiVersion: 'v42',
                config: {}
            });
            hodRequest.method.should.equal('POST');
            hodRequest.apiVersion.should.equal('v42');
            hodRequest.config.should.not.be.empty();
        });

        it('should set params.token if the method is GET', function () {
            hodRequest = new HodRequest(config, 'token', {});
            should.not.exist(hodRequest.headers.token);
        });

        it('should set headers.token if the method is not GET', function () {
            hodRequest = new HodRequest(config, 'token', {
                method: 'POST'
            });
            hodRequest.headers.token.should.not.be.empty();
            should.not.exist(hodRequest.params.token);
        });

        it('should add params to formData if the method is not GET', function () {
            hodRequest = new HodRequest(config, 'token', {
                method: 'POST',
                params: params
            });
            hodRequest.formData.should.not.be.empty();
        });
    });

    describe('getUrl', function () {
        before(function () {
            sinon.stub(HodRequest.prototype, 'getPath').returns('my/path');
        });

        after(function () {
            hodRequest.getPath.restore();
        });

        it('should return the appropriate protocol, host and path in the result', function () {
            hodRequest = new HodRequest(config, 'token', {});
            hodRequest.getUrl().should.startWith('https://api.havenondemand.com/my/path');
        });

        it('should return the correct query string if the method is GET', function () {
            hodRequest = new HodRequest(config, 'token', {
                params: params
            });
            hodRequest.getUrl().indexOf('param=one').should.be.aboveOrEqual(0);
        });

        it('should return no query string if the method is not GET', function () {
            hodRequest = new HodRequest(config, 'token', {
                method: 'POST',
                params: params
            });
            hodRequest.getUrl().indexOf('param=one').should.be.below(0);
        });
    });

    describe('getPath', function () {

        it('should return the appropriate path if the type is sync or async', function () {
            hodRequest = new HodRequest(config, 'token', {
                type: strings.internal.apiTypes.sync,
                path: [
                    'one',
                    'two'
                ]
            });
            hodRequest.getPath().should.equal('2/api/sync/one/two/v1');
        });

        it('should return the appropriate path if the type is platform', function () {
            hodRequest = new HodRequest(config, 'token', {
                type: strings.internal.apiTypes.platform,
                path: [
                    'one',
                    'two'
                ]
            });
            hodRequest.getPath().should.equal('2/one/two');
        });
    });
});

