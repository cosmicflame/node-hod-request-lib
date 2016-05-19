var _ = require('underscore');
var async = require('async');

var hodJobStatuses = require('../strings').internal.jobStatuses;
var debug = require('./services/debug');

var retryStatuses = [
    hodJobStatuses.queued,
    hodJobStatuses.inProgress
];


module.exports = function(api, jobStatusRequest) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        var callback = args.pop();
        var tokenProxy = _.last(args);
        var apiArgs = [this].concat(args);

        var subTasks = [
            api.bind.apply(api, apiArgs),
            _.partial(monitorJob, _, jobStatusRequest.bind(this), this.config, tokenProxy)
        ];

        async.waterfall(subTasks, callback);
    }
};

function monitorJob(job, jobStatusRequest, config, tokenProxy, callback) {
    var retryCount = config.hodPollingLimit,
        exitEarly = false,
        finalResponse;

    var retryCondition = function() {
        return retryCount >= 0 && !exitEarly;
    };

    var pollStatus = function (callback) {
        jobStatusRequest(job.jobId, tokenProxy, function (err, res) {
            retryCount--;

            if (res && _.contains(retryStatuses, res.status)) {
                debug.log('hod', 'Job status has returned pending, retrying job: ' + res.jobId);
                finalResponse = res;
                return _.delay(callback, config.hodPollingIntervalMs);
            } else {
                finalResponse = res;
                exitEarly = true;
                return callback(err);
            }
        });
    };

    async.doWhilst(
        pollStatus,
        retryCondition,
        function (err) {
            if (err || finalResponse.status !== hodJobStatuses.finished) {
                return callback(new Error('Failed and/or timed out waiting for ' + job.jobId), finalResponse);
            }
            return callback(null, finalResponse);
    });
}
