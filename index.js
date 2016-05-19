var api = require('./src/api');
var platform = require('./src/api/platform');
var tokens = require('./src/tokens');
var strings = require('./strings');
var pollingService = require('./src/polling-service');
var SimpleTokenRepository = require('./src/tokens/simple-token-repository');

/*
    Expose the HodRequests constructor
 */
exports = module.exports = HodRequestLib;


/*
    Expose other utilities and constructors
 */
exports.tokens = tokens.tokens;
exports.signing = tokens.signing;
exports.enums = strings.external;
exports.SimpleTokenRepository = SimpleTokenRepository;

function HodRequestLib(config) {
    this.config = {
        tokenRepository: config && config.tokenRepository || new SimpleTokenRepository(),
        hodProtocol: config && config.hodProtocol || 'https',
        hodApiHost: config && config.hodApiHost || 'api.havenondemand.com',
        hodPollingLimit: config && config.hodPollingLimit || 60,
        hodPollingIntervalMs: config && config.hodPollingIntervalMs || 2000,
        requestTimeout: config && config.requestTimeout || 120000
    }
}

/*
    Attach platform APIs
 */
for (var platformApiName in platform) {
    if (platform.hasOwnProperty(platformApiName)) {
        HodRequestLib.prototype[platformApiName] = platform[platformApiName];
    }
}


/*
    Attach API methods
 */
//TODO: Object.keys
for (var apiName in api) {
    if (api.hasOwnProperty(apiName)) {
        HodRequestLib.prototype[apiName + 'Sync'] = api[apiName](strings.internal.apiTypes.sync);
        HodRequestLib.prototype[apiName + 'Async'] = api[apiName](strings.internal.apiTypes.async);
        HodRequestLib.prototype[apiName + 'PollingService'] = pollingService(api[apiName](strings.internal.apiTypes.async), HodRequestLib.prototype.jobStatus);
    }
}
