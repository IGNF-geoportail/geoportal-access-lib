
import Logger from "../../../Utils/LoggerByDefault";
import _ from "../../../Utils/MessagesResources";
import ProcessIsoCurveParam from "./model/ProcessIsoCurveParam";

/**
 * @classdesc
 * Classe de gestion des requêtes sur le service de calcul d'isoschrone/isodistance.
 *  Les requêtes peuvent être en mode GET ou POST,
 *  et le format de sorti est en JSON.
 *
 * @constructor
 * @alias Gp.Services.ProcessIsoCurve.Request.ProcessIsoCurveRequest
 * @param {Object} options - options
 *
 * @example
 * var options = {
 *      httpMethod : 'GET', // GET|POST
 *      // spécifique au service
 *      position : {
 *          x : 2.3242664298058053,
 *          y : 48.86118017324745
 *      },
 *      graph : "car",
 *      method : 'time',
 *      time : 1000, //distance : 200
 *      reverse : false,
 *      srs : 'EPSG:4326'
 *  };
 *
 * try {
 *
 *      var oIsoCurve = new ProcessIsoCurveRequest (options);
 *      if (!oIsoCurve.processRequestString ()) {
 *          // error
 *      }
 *
 *      var request = oIsoCurve.requestString;
 *
 * } catch (e) {
 *      // error
 * }
 * @private
 */
function ProcessIsoCurveRequest (options) {
    this.logger = Logger.getLogger("ProcessIsoCurveRequest");
    this.logger.trace("[Constructeur ProcessIsoCurveRequest ()]");

    if (!(this instanceof ProcessIsoCurveRequest)) {
        throw new TypeError("ProcessIsoCurveRequest constructor cannot be called as a function.");
    }

    // existance des options
    if (!options) {
        throw new Error(_.getMessage("PARAM_EMPTY", "options"));
    }

    /**
     * Liste des options
     */
    this.settings = options;

    /**
     * Mode HTPP.
     * Par defaut, "GET".
     * @type {String}
     */
    this.mode = this.settings.httpMethod || "GET";
}

ProcessIsoCurveRequest.prototype = {

    /**
     * @lends module:ProcessIsoCurveRequest#
     */

    /**
     * Requête
     * @type {String}
     */
    requestString : null,

    /**
     * Constructeur (alias)
     */
    constructor : ProcessIsoCurveRequest,

    /**
     * Construction de la requête.
     *
     * @example
     * // GET  out :
     *   //  (http://wxs.ign.fr/KEY/isochrone?)
     *   //  resource=&
     *   //  point=&
     *   //  costValue=& 
     *   //  costType=&
     *   //  profile=&
     *   //  constraints=&
     *   //  direction=&
     *   //  crs=
     *
     * // POST out :
     * {
     *  resource: "bduni-idf-pgr",
     *  point: "2.337306,48.849319",
     *  costValue: 100,
     *  costType: "time",
     *  profile: "car",
     *  constraints: [{
     *      constraintType: "banned",
     *      key: "ways_type",
     *      operator: "=",
     *      value: "autoroute"
     *  }]
     * }
     *
     * @returns {String} request
     */
    processRequestString : function () {
        var request = "";
        var i = 0;

        switch (this.mode) {
            case "GET":
                this.logger.trace("Process GET Request");

                // Mapping des options avec le service de l'API REST
                var oParams = new ProcessIsoCurveParam(this.settings);
                var params = oParams.getParams();

                for (i = 0; i < params.length; i++) {
                    var o = params[i];
                    if (request) {
                        request += "&";
                    }
                    request += o.k + "=" + o.v;
                }

                break;

            case "POST":
                this.logger.trace("Process POST Request");
                // creation du JSON
                var postRequest = {};

                postRequest.resource = this.settings.resource;

                postRequest.point = this.settings.position.x + "," + this.settings.position.y;

                if (this.settings.method === "distance") {
                    postRequest.costType = "distance";
                    postRequest.costValue = this.settings.distance;
                } else {
                    postRequest.costType = "time";
                    postRequest.costValue = this.settings.time;
                }
                
                postRequest.profile = this.settings.graph;

                if (this.settings.reverse) {
                    postRequest.direction = "arrival";
                } else {
                    postRequest.direction = "departure";
                }

                postRequest.constraints = this.settings.constraints;

                postRequest.distanceUnit = this.settings.distanceUnit;

                postRequest.timeUnit = this.settings.timeUnit;

                postRequest.crs = this.settings.srs;

                // conversion en chaîne de caractères
                request = JSON.stringify(postRequest);
                break;

            default:
                this.logger.error("No other HTTP method supported by the service !");
        }

        this.logger.trace(request);
        this.requestString = request;

        return this.requestString;
    }
};

export default ProcessIsoCurveRequest;
