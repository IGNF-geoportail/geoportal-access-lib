/* global module, require, __dirname */

var requirejs = require("requirejs");

requirejs.config({
    baseUrl : __dirname + "/../../../src",
    nodeRequire : require,
    paths : {
        // lib external
        log4js : "../node_modules/woodman/dist/woodman-amd",
        'es6-promise' : "../node_modules/es6-promise/dist/es6-promise",
        // config du logger
        "logger-cfg" : "Utils/Logger.cfg"
    }
});

var AutoConf = requirejs("Services/AutoConf/AutoConf");

var options = {
    apiKey : 'jhyvi0fgmnuxvfv0zjzorvdn',
    protocol : 'XHR',
    onSuccess : function (response) {
        console.log(response);
    }
};

var obj = new AutoConf(options);
obj.call();