/**
 * Factory pour générer une reponse JSON à partir d'un JSON
 * (Factory)
 *
 * @module ProcessIsoCurveResponseFactory
 * @alias Gp.Services.ProcessIsoCurve.Response.ProcessIsoCurveResponseFactory
 * @private
 */
import Logger from "../../../Utils/LoggerByDefault";
import MRes from "../../../Utils/MessagesResources";
import ErrorService from "../../../Exceptions/ErrorService";
import ProcessIsoCurveResponse from "./model/ProcessIsoCurveResponse";

var ProcessIsoCurveResponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant ProcessIsoCurve
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
        var logger = Logger.getLogger("ProcessIsoCurveResponseFactory");
        logger.trace(["ProcessIsoCurveResponseFactory::build()"]);

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

                // analyse de la reponse
                // création de l'objet de réponse
                data = new ProcessIsoCurveResponse();

                // remplissage de l'objet créé avec les attribtuts de la réponse du service
                if (data) {
                    if (data.costValue === "distance") {
                        data.time = "";
                        data.distance = JSONResponse.distance;
                    } else {
                        data.time = JSONResponse.time;
                        data.distance = "";
                    }
                    
                    data.message = "";
                    data.id = "";
                    data.srs = JSONResponse.crs;
                    data.geometry = JSONResponse.geometry;
                    var coords = JSONResponse.point.split(",");
                    if (data.location) {
                        data.location.x = coords[0];
                        data.location.y = coords[1];
                    }
                } else {
                    options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_ANALYSE", options.response)));
                    return;
                }

                // info : en cas de problèmes de droits (clé invalide ou autre), la réponse est au format XML !!
                // ex. <ExceptionReport><Exception exceptionCode="MissingParameter">Key does not exist or has expired</Exception></ExceptionReport>
                // mais le statut est 403, l'erreur est donc remontée plus tôt.
                if (data && data.exceptionReport) {
                    options.onError.call(options.scope, new ErrorService({
                        message : MRes.getMessage("SERVICE_RESPONSE_EXCEPTION", data.exceptionReport),
                        type : ErrorService.TYPE_SRVERR,
                        status : 200
                    }));
                    return;
                }
            }
        } else {
            // si la réponse est vide, on appelle le callback d'erreur
            options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_EMPTY")));
            return;
        }

        // si tout s'est bien passé, on appelle le callback de succès
        options.onSuccess.call(options.scope, data);
    }
};

export default ProcessIsoCurveResponseFactory;
