/* global __PRODUCTION__ */
import * as Log from "loglevel";

var LoggerByDefault = {
    /** logger statique */
    getLogger : function (name) {
        // Substitute global constants configured at compile time
        // cf. webpack.config.js
        ( __PRODUCTION__ ) ?
            Log.disableAll() : Log.enableAll();
        var logname = name || "default";
        return Log.getLogger(logname);
    }
};

export default LoggerByDefault;
