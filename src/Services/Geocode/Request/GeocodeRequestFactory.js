/**
 * Creation d'une requête
 * (Factory)
 *
 * @module GeocodeRequestFactory
 * @alias Gp.Services.Geocode.Request.GeocodeRequestFactory
 * @private
 */
import Logger from "../../../Utils/LoggerByDefault";
import GeocodeRequestREST from "./GeocodeRequestREST";

var GeocodeRequestFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Geocode
     *
     * @example
     *   var options = {
     *      // options specifiques du service
     *      geocodeMethod:
     *      query:
     *      filters:
     *      maximumResponses:
     *   };
     *   var result = GeocodeRequestFactory.build(options);
     *   if (!result) {
     *       // error...
     *   }
     * @returns {String} request
     */
    build : function (options) {
        // logger
        var logger = Logger.getLogger("GeocodeRequestFactory");
        logger.trace(["GeocodeRequestFactory::build()"]);

        var settings = options || {};

        var myReq = new GeocodeRequestREST(settings);
        if (!myReq.processRequestString()) {
            throw new Error("Error process request (rest) !");
        }
        var request = myReq.requestString;

        logger.trace(request);

        return request;
    }
};

export default GeocodeRequestFactory;
