# node-hod-request-lib

A client library for communicating with [HPE Haven OnDemand](http://www.havenondemand.com) (HoD).

node-hod-request-lib currently only supports HoD platform version 2.

Only a subset of HoD APIs are currently available through the library.

## Usage

node-hod-request-lib exposes a constructor for instantiating the library with various configuration options:

    var HodRequestLib = require('hod-request-lib');
    var hodRequestLib = new HodRequestLib(opts);

    // Make a request
    hodRequestLib.analyzeSentimentSync(
        text,
        language,
        tokenProxy,
        callback
    );

The following useful utilities are also exposed:

    // Utility for generating various token strings
    var tokens = require('hod-request-lib').tokens

    // Utility for signing requests, needed for authentication
    var signing = require('hod-request-lib').signing

    // In-memory token repository implementation
    // An instance of this can be used as the tokenRepository configuration option when instnatiating the library
    var SimpleTokenRepository = require('hod-request-lib').SimpleTokenRepository;
    var tokenRepository = new SimpleTokenRepository();

    var hodRequestLib new HodRequestLib({
        tokenRepository: tokenRepository
    });

## License
Copyright 2016 Hewlett Packard Enterprise Development LP

Licensed under the MIT License (the "License"); you may not use this project except in compliance with the License.
