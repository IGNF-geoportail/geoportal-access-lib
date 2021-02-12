/**
 * Factory pour générer une reponse JSON à partir d'un XML ou d'un JSON
 * (Factory)
 *
 * @module RouteResponseFactory
 * @alias Gp.Services.Route.Response.RouteResponseFactory
 * @private
 */
import Logger from "../../../Utils/LoggerByDefault";
import MRes from "../../../Utils/MessagesResources";
import ErrorService from "../../../Exceptions/ErrorService";
import RouteResponse from "./model/RouteResponse";
import RouteInstruction from "./model/RouteInstruction";

var RouteResponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Route
     *
     * @example
     *   var options = {
     *      response :
     *      outputFormat :
     *      rawResponse :
     *      scope :
     *      onSuccess :
     *      onError :
     *   };
     *
     */
    build : function (options) {
        // logger
        var logger = Logger.getLogger("RouteResponseFactory");
        logger.trace("RouteResponseFactory::build()");

        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                logger.trace("analyze response : raw");
                data = options.response;
            } else {
                logger.trace("analyze response : json");

                var JSONResponse;
                if (typeof options.response === "string") {
                    JSONResponse = JSON.parse(options.response);
                } else {
                    JSONResponse = options.response;
                }

                // le service renvoie t il une erreur ?
                if (JSONResponse.message) {
                    // ex. {"message":"message not null", "status":"ERROR"}
                    options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_EXCEPTION", JSONResponse.message)));
                    return;
                }

                // construction de l'objet réponse JSON
                if (JSONResponse) {
                    var legs = [];
                    var legSteps = [];
                    var steps = [];

                    data = new RouteResponse();

                    if (data.hasOwnProperty("totalTime")) {
                        data.totalTime = parseFloat(JSONResponse.duration);
                    }
                    if (data.hasOwnProperty("totalDistance")) {
                        data.totalDistance = JSONResponse.distance + " " + options.distanceUnit;
                    }

                    if (data.hasOwnProperty("bbox")) {
                        data.bbox.left = parseFloat(JSONResponse.bbox[0]);
                        data.bbox.bottom = parseFloat(JSONResponse.bbox[1]);
                        data.bbox.right = parseFloat(JSONResponse.bbox[2]);
                        data.bbox.top = parseFloat(JSONResponse.bbox[3]);
                    }

                    if (data.hasOwnProperty("routeGeometry")) {
                        data.routeGeometry = JSONResponse.geometry;
                    }

                    if (data.hasOwnProperty("routeInstructions")) {
                        var legList = JSONResponse.portions;
                        var i;
                        if (Array.isArray(legList) && legList.length) {
                            for (i = 0; i < legList.length; i++) {
                                legs.push(legList[i]);
                            }
                        }
                        if (legs.length) {
                            for (i = 0; i < legs.length; i++) {
                                legSteps.push(legs[i].steps);
                            }
                        }
                        if (legSteps.length) {
                            for (i = 0; i < legSteps.length; i++) {
                                steps = steps.concat(legSteps[i]);
                            }
                        }

                        steps.forEach(function (step) {
                            data.routeInstructions.push(new RouteInstruction());
                            data.routeInstructions[data.routeInstructions.length - 1].duration = step.duration;
                            data.routeInstructions[data.routeInstructions.length - 1].distance = step.distance + " " + options.distanceUnit;
                            data.routeInstructions[data.routeInstructions.length - 1].code = "";
                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "";
                            data.routeInstructions[data.routeInstructions.length - 1].geometry = step.geometry;
                        });
                    }
                }

                if (!data) {
                    options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_ANALYSE", "json")));
                    return;
                }

                // Si la réponse contenait une exception renvoyée par le service
                if (data.exceptionReport) {
                    options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_EXCEPTION_2")));
                    return;
                }
            }
        } else {
            options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_EMPTY")));
            return;
        }

        options.onSuccess.call(options.scope, data);
    }
};

export default RouteResponseFactory;
