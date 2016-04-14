var sinon = require('sinon');
var should = require('should');

var HodResponse = require('../src/models/hod-response');


describe('HoD Response Model', function() {
    var hodResponse;

    describe('constructor', function () {
        beforeEach(function () {
           sinon.spy(HodResponse.prototype, 'parseResponse')
        });

        afterEach(function () {
            hodResponse.parseResponse.restore();
        });

        it('should call parseResponse if given a valid JSON response body', function () {
            hodResponse = new HodResponse('{ "someValid": "json"}');
            hodResponse.parseResponse.calledWithExactly({
                someValid: 'json'
            }).should.be.true();
        });

        it('should set an error if given an invalid JSON response body', function () {
            hodResponse = new HodResponse('{ someInvalidJson }');
            hodResponse.parseResponse.called.should.be.false();
            should.exist(hodResponse.error);
            hodResponse.error.should.not.equal('');
        });

        it('should set an error if given no response body', function () {
            hodResponse = new HodResponse('');
            hodResponse.parseResponse.called.should.be.false();
            should.exist(hodResponse.error);
            hodResponse.error.should.not.equal('');
        });
    });

    describe('parseResponse', function () {
        it('should set a jobId property if given JSON containing a jobId', function () {
            hodResponse = new HodResponse('{ "jobID": 123 }');
            hodResponse.jobId.should.equal(123);
        });

        it('should set a status property if given JSON containing a status', function () {
            hodResponse = new HodResponse('{ "status": "done" }');
            hodResponse.status.should.equal('done');
        });

        it('should set a result property if given JSON containing an async result', function () {
            hodResponse = new HodResponse('{ ' +
                '"actions": [' +
                    '{' +
                        '"result": { "answer": "abc" }' +
                    '}' +
                ']' +
            '}');
            hodResponse.result.answer.should.equal('abc');
        });

        it('should set a result property if given JSON containing a sync result', function () {
            hodResponse = new HodResponse('{ "answer": "abc" }');
            hodResponse.result.answer.should.equal('abc');
        });
    });

    describe('parseError', function () {
        it('should set an error and errorCode property if given JSON containing a sync error', function () {
            hodResponse = new HodResponse('{ "error": 8001, "reason": "because" }');
            hodResponse.errorCode.should.equal(8001);
            should.exist(hodResponse.error);
            hodResponse.error.should.not.equal('');
        });

        it('should set an error and errorCode property if given JSON containing an async error', function () {
            hodResponse = new HodResponse('{ ' +
                '"actions": [' +
                    '{' +
                        '"errors": [{ "error": 8001, "reason": "because" }]' +
                    '}' +
                ']' +
            '}');
            hodResponse.errorCode.should.equal(8001);
            should.exist(hodResponse.error);
            hodResponse.error.should.not.equal('');
        });
    });
});

