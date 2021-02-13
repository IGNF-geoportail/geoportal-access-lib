/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "point|circle|bbox" }] */

/**
* Geoportal web services invocation namespace.
*
* @module Services
* @alias Gp.Services
*/
import Alti from "./Alti/Alti";
import AutoConf from "./AutoConf/AutoConf";
import Geocode from "./Geocode/Geocode";
import ReverseGeocode from "./Geocode/ReverseGeocode";
import AutoComplete from "./AutoComplete/AutoComplete";
import Route from "./Route/Route";
import ProcessIsoCurve from "./ProcessIsoCurve/ProcessIsoCurve";

var Services = {
    /**
     * Access to Geoportal resources metadata availables with one ore several keys, using [Auto-configuration service]{@link https://wxs.ign.fr/APIKEY/autoconf} of the Geoportal platform.
     *
     * @method getConfig
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.GetConfigResponse} object as a parameter except if "rawResponse" parameter is set to true : a String will be returned.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/autoconf] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=JSONP] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting an underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    getConfig : function (options) {
        var autoconfService = new AutoConf(options);
        autoconfService.call();
    },

    /**
     * Getting elevations in or along of one or several points on french territories using the [elevation services of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/alti.html}.<br/>
     * Two use cases are availables :<br/>
     * 1. getting elevations of the given points : don't use the options.sampling parameter ;<br/>
     * 2. getting a regular set of elevations along the given points : use the options.sampling parameter.
     *
     * @method getAltitude
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {Array.<Object>} options.positions - Array of positions ({lon:float, lat:float}) expressed in CRS:84 coordinates system, where to get elevations. 50 positions maximum may be given. 2 positions minimum are required if you use the options.sampling parameter.
     * @param {Number} [options.sampling] - Number of points to use (between 2 and 5000) in order to compute an elevation path. The points given with the options.positions parameter are used to fix the planimetric path along which the elevations will be computed.<br/>
     * If not used, only elevations of these positions will be returned.
     * @param {Boolean} [options.zonly=false] - Set this parameter to true if you only want to have elevations returned without corresponding coordinates.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.AltiResponse} object as a parameter, except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/alti/rest/elevation.json] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=XHR] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     * @param {String} [options.api='REST'] - What API to use for interacting with underlying web service : 'REST' or 'WPS'. Only use if you know what you are doing.
     * @param {String} [options.outputFormat='xml'] - Output format for underlying web service response : 'xml' or 'json'. Only use if you know what you are doing.
     */
    getAltitude : function (options) {
        var altiService = new Alti(options);
        altiService.call();
    },
    /**
     * Getting positon of a geographic identifier (places names, address, cadastral parcel, other...) using the [geocoding web service of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/geocodage.html}.
     *
     * @example
     * Gp.Services.geocode ({
     *     apiKey : "jhyvi0fgmnuxvfv0zjzorvdn",
     *     query : "73 avenue de Paris, Saint-Mandé",
     *     // traitement des resultats
     *     onSuccess  : function (result) {
     *         console.log("found (x:"+result.position.x+", y:"+result.position.y+")") ;
     *     }
     * }) ;
     *
     *
     * @method geocode
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {String} [options.index="StreetAddress"] - Geographical identifier type to search. Values currently availables are : "PositionOfInterest" for place names, "StreetAddress" for address search, "CadastralParcel" for Cadastral parcels search, "location" for a multi-index search on "StreetAddress" and "PositionOfInterest". Default is "StreetAddress".
     * @param {String} options.query - Geographic identifier to locate.
     * @param {Object} [options.filters] - Additional filters to apply to search. The following properties may be given.
     *      @param {String} [options.filters.[prop]] - Additionnal properties to filter search. Properties depends on options.index, and values type should be "String".
     *      <br/><br/>
     *      Properties availables for address search :<br/>
     *      "postalCode", "inseeCode" and "city".
     *      <br/><br/>
     *      Properties availables for place names search :<br/>
     *      "postalCode", "inseeCode" and "type".
     *      <br/><br/>
     *      Properties availables for cadastral parcels search :<br/>
     *      "codeDepartement", "codeCommune", "nomCommune", "codeCommuneAbs", "codeArrondissement", "section", "numero", "feuille".
     * @param {Number} [options.maximumResponses=20] - Maximum number of responses. Default underlying service value applies (20) if not provided.
     * @param {Boolean} [options.returnTrueGeometry=false] - Set this parameter to true if you wish to have the true geometrie returned.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.GeocodeResponse} object as a parameter except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/geoportail/ols] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    geocode : function (options) {
        var geocodeService = new Geocode(options);
        geocodeService.call();
    },
    /**
     * Retrieving geographical identifiers (place names, address, cadastral parcels, ...) near a given position, using the [reverse geocoding web service of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/geocodage-inverse.html}.
     *
     * @method reverseGeocode
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {String} [options.index="StreetAddress"] - Geographical identifier type to search. Values currently availables are : "PositionOfInterest" for place names, "StreetAddress" for address search, "CadastralParcel" for Cadastral parcels search, "location" for a multi-index search on "StreetAddress" and "PositionOfInterest". Default is "StreetAddress".
     * @param {Object} options.position - Reference position where to search geographical identifiers.
     *      @param {Float} options.position.lon - Longitude
     *      @param {Float} options.position.lat - Latitude
     * @param {Object} [options.filters] - Additional filters to apply to search. The following properties may be given.
     *      @param {String} [options.filters.[prop]] - Additionnal properties to filter search. Properties depends on options.index, and values type should be "String".
     *      <br/><br/>
     *      Properties availables for address search :<br/>
     *      "postalCode", "inseeCode" and "city".
     *      <br/><br/>
     *      Properties availables for place names search :<br/>
     *      "postalCode", "inseeCode" and "type".
     *      <br/><br/>
     *      Properties availables for cadastral parcels search :<br/>
     *      "codeDepartement", "codeCommune", "nomCommune", "codeCommuneAbs", "codeArrondissement", "section", "numero", "feuille".
     * @param {Object} [options.searchGeometry] - Location where to perform the search.
     *      @param {String} options.searchGeometry.type - Geometry type (Point|Circle|Linestring|Polygon)
     *      @param {Array.<Float>|Array.Array.<Float>} options.searchGeometry.coordinates - Coordinates
     *      @param {Float} [options.searchGeometry.radius] - Radius (only for type 'Circle')
     * @param {Number} [options.maximumResponses=20] - Maximum number of responses. Default underlying service value applies (20) if not provided.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.GeocodeResponse} object as a parameter except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/geoportail/ols] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    reverseGeocode : function (options) {
        var reverseGeocodeService = new ReverseGeocode(options);
        reverseGeocodeService.call();
    },
    /**
     * Getting suggestions of probable places names or address based on uncomplete texts, using the [autocompletion service of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/autocompletion.html}
     *
     * @method autoComplete
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {String} options.text - Text input to complete.
     * @param {Array.<String>} [options.filterOptions.type = "StreetAddress"] - Suggestion types to provide : address ("StreetAddress") and/or place name ("PositionOfInterest").
     * @param {Array.<String>} [options.filterOptions.territory] - Places where to limit the search of suggestions : "METROPOLE" (Corsica and metropolitan France), "DOMTOM" (French overseas departments and territories), or an INSEE code of a department. No limitation by default. For instance : ['METROPOLE', '31']
     * @param {Number} [options.maximumResponses = 10] - Maximum number of responses.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.AutoCompleteResponse} object as a parameter except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/ols/apis/completion] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=XHR] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    autoComplete : function (options) {
        var autoCompleteService = new AutoComplete(options);
        autoCompleteService.call();
    },
    /**
     * Getting a route from one point to another using the [route service of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/itineraires.html}.
     *
     * @method route
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {String} [options.routePreference = "fastest"] - Indicates the way to compute the route : "fastest" (time optimisation) or "shortest" (distance optimisation).
     * @param {Gp.Point} options.startPoint - Start point of the route. Expressed in CRS:84 coordinates system (startPoint.x corresponds to longitude, startPoint.y corresponds to latitude).
     * @param {Gp.Point} options.endPoint - End point of the route. Expressed in CRS:84 coordinates system (endPoint.x corresponds to longitude, endPoint.y corresponds to latitude).
     * @param {Array.<Gp.Point>} [options.viaPoints] - Ordered via Points of the route. Expressed in CRS:84 coordinates system (viaPoints[i].x corresponds to longitude, viaPoints[i].y corresponds to latitude).
     * @param {String} [options.graph = "Voiture"] - User profile to use to compute the route : "Voiture" (using a vehicule) or "Pieton" (pedestrian). Has an influence on the kind of roads the route may use and the average speed.
     * @param {Array.<String>} [options.exclusions] - Indicates if route has to avoid some features ("toll", "bridge" or "tunnel").
     * @param {Boolean} [options.geometryInInstructions = false] - Indicates if route geometry has to be also returned with route instructions.
     * @param {Boolean} [options.provideBoundingBox = true] - Indicates if route instructions has to be localised with a BBOX in the response.
     * @param {String} [options.distanceUnit = "km"] - The unit used to provide distances in the response ("m" or "km").
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.RouteResponse} object as a parameter except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.outputFormat='json'] - Output format ("json" or "xml") to use for underlying webService. Only use if you know what you are doing.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/itineraire/rest/route.json] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=XHR] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    route : function (options) {
        var routeService = new Route(options);
        routeService.call();
    },
    /**
     * Computing a set of places (curve) reachable from a given point (or from where to start to reach a given point) within a time or distance constraint using the [isochrone service of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/isochrones.html}.
     *
     * @method isoCurve
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {Gp.Point} options.position - Start or Arrival (options.reverse===true) Point for the computing. Expressed in CRS:84 coordinates system (position.x corresponds to longitude, position.y corresponds to latitude).
     * @param {String} [options.graph = "Voiture"] - User profile to use to compute the isoCurve : "Voiture" (using a vehicule) or "Pieton" (pedestrian). Has an influence on the kind of roads to use and the average speed.
     * @param {Array.<String>} [options.exclusions] - Indicates if route has to avoid some features ("toll", "bridge" or "tunnel").
     * @param {String} [options.method = "time"] - Computing method to use : "time" (using a duration as a constraint) or "distance" (using a distance as a constraint).
     * @param {Float} options.time - Maximum duration (expressed in seconds) to use when options.method is set to "time".
     * @param {Float} options.distance - Maximum distance (expressed in meters) to use when options.method is set to "distance".
     * @param {Boolean} [options.reverse = false] - Set this parameter to true if you want options.position to be the destination (instead of departure) for the computing.
     * @param {Boolean} [options.smoothing = false] - Set this parameter to true if you want the resulting geometry to be smoothed.
     * @param {Boolean} [options.holes = false] - Set this parameter to true if you want the resulting geometry (polygon) to have holes if pertinent.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.IsoCurveResponse} object as a parameter except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.outputFormat='json'] - Output format ("json" or "xml") to use for underlying webService. Only use if you know what you are doing.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/isochrone/isochrone.json] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=XHR] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    isoCurve : function (options) {
        var processIsoCurveService = new ProcessIsoCurve(options);
        processIsoCurveService.call();
    }
};

/**
 * Point object.
 *
 * @namespace
 * @alias Gp.Point
 *
 * @property {Float} x - Point abscissa
 * @property {Float} y - Point ordinate
 */
var point = {};

/**
 * Circle object.
 *
 * @namespace
 * @alias Gp.Circle
 *
 * @property {Float} x - Circle center abscissa.
 * @property {Float} y - Circle center ordinate.
 * @property {Float} radius - Circle radius.
 */
var circle = {};

/**
 * Bounding box object, expressed with four coordinates.
 *
 * @namespace
 * @alias Gp.BBox
 *
 * @property {Float} left - minimum abscissa
 * @property {Float} right - maximum abscissa
 * @property {Float} bottom - minimum ordinate
 * @property {Float} top - maximum ordinate
 */
var bbox = {};

export default Services;
