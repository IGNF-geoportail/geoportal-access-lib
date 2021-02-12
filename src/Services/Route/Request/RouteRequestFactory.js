/**
 * Creation d'une requête REST en mode POST ou GET
 * (Factory)
 *
 * @module RouteRequestFactory
 * @alias Gp.Services.Route.Request.RouteRequestFactory
 * @private
 */
import Logger from "../../../Utils/LoggerByDefault";
import ErrorService from "../../../Exceptions/ErrorService";
import RouteRequestREST from "./RouteRequestREST";

var RouteRequestFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Route
     *
     * @example
     *   // utilisation avec les callback
     *   var options = {
     *      (...)
     *      onSuccess : function (response) {},
     *      onError : function (error) {},
     *      // spécifique au service
     *      startPoint : {
     *          x : 42.1121,
     *          y : 1.5557
     *      },
     *      endPoint : {
     *          x : 42.1121,
     *          y : 1.5557
     *      },
     *      provideBbox : false,
     *      exclusions : ["bridge", "tunnel", "toll"],
     *      distanceUnit : "km",
     *      graph : "Voiture",
     *      geometryInInstructions : false,
     *      routePreference : "fastest"
     *   };
     *   RouteRequestFactory.build(options);
     *
     *   // utilisation sans callback
     *   var options = {...};
     *   try {
     *      var result = RouteRequestFactory.build(options);
     *      if (! result) { throw new Error("..."):}
     *   } catch (e) {
     *      // todo
     *   }
     * @returns {String} request
     */
    build : function (options) {
        // logger
        var logger = Logger.getLogger("RouteRequestFactory");
        logger.trace(["RouteRequestFactory::build()"]);

        var request = null;

        var settings = options || {};

        // gestion des callback
        var bOnError = !!((options.onError !== null && typeof options.onError === "function"));

        var message = null;

        // FIXME les exceptions ne sont pas 'catchées' sur le constructeur !
        var myReq = new RouteRequestREST(settings);
        if (!myReq.processRequestString()) {
            message = "Error process request (rest) !";
            if (bOnError) {
                options.onError.call(options.scope, new ErrorService(message));
                return;
            }
            throw new Error(message);
        }
        request = myReq.requestString;

        return request;
    }
};

export default RouteRequestFactory;
