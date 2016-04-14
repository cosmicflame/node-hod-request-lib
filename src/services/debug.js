var debug = require('debug');
var error = debug('hod-request-lib:error');
var log = debug('hod-request-lib:log');

log.log = console.log.bind(console);

module.exports = {
    error: error,
    log: log
};
