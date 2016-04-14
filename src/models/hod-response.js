var _ = require('underscore');
var debug = require('../services/debug');

module.exports = HodResponse;

function HodResponse(body, statusCode) {
    this.error = "";
    this.errorCode = -1;
    this.jobId = "";
    this.status = "";
    this.result = "";
    this.httpStatusCode = statusCode;

    var response;
    if (body) {
        try {
            response = JSON.parse(body);
            this.parseResponse(response);
        } catch (e) {
            debug.error(e.message);
            this.error = new Error('HoD returned an invalid JSON response');
        }
    } else {
        var message = 'HoD returned an empty response body';
        debug.error(message);
        this.error = new Error(message);
    }
}


HodResponse.prototype.parseResponse = function (response) {
    if (_.has(response, 'jobID')) {
        this.jobId = response.jobID;
    }

    if (_.has(response, 'status')) {
        this.status = response.status;
    }

    if (_.has(response, 'actions') && _.has(response.actions[0], 'result')) {
        //async expected response schema
        this.result = response.actions[0].result;
    } else {
        //sync expected response schema
        this.result = response;
    }

    this.parseErrors(response);
};

HodResponse.prototype.parseErrors = function (response) {
    if (_.has(response, 'error')) {
        this.error = new Error(response.error + " - " + response.reason);
        this.errorCode = response.error;
    } else if (_.has(response, 'actions') && _.has(response.actions[0], 'errors') && response.actions[0].errors.length > 0) {
        var errorObj = response.actions[0].errors[0];
        this.error = new Error(errorObj.error + " - " + errorObj.reason);
        this.errorCode = errorObj.error;
    }
};
