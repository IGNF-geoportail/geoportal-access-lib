/* global module, require, __dirname */

var requirejs = require('requirejs');

requirejs.config({
    baseUrl : __dirname + '/../../src',
    nodeRequire : require,
    paths : {
        // lib external
        "log4js" : "../lib/external/woodman/woodman-amd",
        'promise' : '../lib/external/promise',
        // config du logger
        "logger-cfg" : "Utils/Logger.cfg"
    }
});

var Gp = requirejs('Gp');

console.log("Loading context...", Gp);
