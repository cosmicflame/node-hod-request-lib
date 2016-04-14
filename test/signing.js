var signing = require('../').signing;

describe('HoD Signing', function() {
    describe('hashBody', function () {
        it('should return a string', function () {
            signing.hashBody({ key: 'val' }).should.be.String();
        });

        it('should return an empty string given an empty, undefined or non-object body', function () {
            signing.hashBody({}).should.equal('');
            signing.hashBody().should.equal('');
            signing.hashBody('abc').should.equal('');
        });

        it('should return the correct hash', function () {
            signing.hashBody({
                key: 'val'
            }).should.equal('9eRYO6jtUigq-ac3nZHPAQ');

            signing.hashBody({
                'key to encode': 'val to encode'
            }).should.equal('Lqt7PhuC2FcDmo_Um9G4Vw');

            signing.hashBody({
                array: ['one', 'two', 'three']
            }).should.equal('DeSheAnq8ugYUmWUCOECAQ');
        });
    });

    describe('signRequest', function () {
        var request = {
            path: '/some-kind-of/path',
            method: 'GET',
            query: [
                ['array', ['one', 'two', 'three']],
                ['string', 'four'],
                ['number', 56],
                ['encode me', 'seven eight']
            ],
            body: {
                key: 'val'
            }
        };

        it('should throw given a null secret', function () {
            (function () {
                signing.signRequest(null, '', {});
            }).should.throw();
        });

        it('should throw given a request with no method', function () {
            (function () {
                signing.signRequest('abc', '', {});
            }).should.throw();
        });

        it('should return a string given a request with no method', function () {
            signing.signRequest('abc', '', request).should.be.String();
        });

        it('should return the correct hash', function () {
            signing.signRequest('abc', '9eRYO6jtUigq-ac3nZHPAQ', request).should.equal('0JMVjxHp0hpLPVYiqo7EuNnP8Jk');
        });
    });
});
