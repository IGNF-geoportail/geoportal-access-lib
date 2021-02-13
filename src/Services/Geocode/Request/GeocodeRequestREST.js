
import Logger from "../../../Utils/LoggerByDefault";
import _ from "../../../Utils/MessagesResources";
import GeocodeParamREST from "./model/GeocodeParamREST";

/**
 * @classdesc
 * Classe de gestion des requêtes de type REST sur le service de calcul d'itineraire
 * (uniquement en GET)
 *
 * @constructor
 * @alias Gp.Services.Geocode.Request.GeocodeRequestREST
 * @param {Object} options - options definies dans le composant Route
 *
 * @example
 * var options = {
 *      (...)
 * };
 *
 * @private
 */
function GeocodeRequestREST (options) {
    this.logger = Logger.getLogger("GeocodeRequestREST");
    this.logger.trace("[Constructeur GeocodeRequestREST ()]");

    if (!(this instanceof GeocodeRequestREST)) {
        throw new TypeError("GeocodeRequestREST constructor cannot be called as a function.");
    }

    // existance des options
    if (!options) {
        throw new Error(_.getMessage("PARAM_EMPTY", "options"));
    }

    /** liste des options */
    this.settings = options;
}

GeocodeRequestREST.prototype = {

    /**
     * @lends module:GeocodeRequestREST#
     */

    /**
     * request
     * @type {String}
     */
    requestString : null,

    /**
     * Constructeur (alias)
     */
    constructor : GeocodeRequestREST,

    /**
     * Construction de la requête.
     *
     * @returns {String} request
     */
    processRequestString : function () {
        var request = "";

        // Mapping des options avec le service de l'API REST
        const oParams = new GeocodeParamREST(this.settings);

        const params = oParams.getParams();
        for (var i = 0; i < params.length; i++) {
            var o = params[i];
            if (request) {
                request += "&";
            }
            request += o.k + "=" + o.v;
        }

        var index = oParams.getIndex();

        if (!this.settings.geocodeMethod || (this.settings.geocodeMethod !== "search" && this.settings.geocodeMethod !== "reverse")) {
            throw new Error("Error geocodeMethod not valid");
        }

        this.requestString = "/" + index + "/" + this.settings.geocodeMethod + "/?" + request;
        this.logger.trace(this.requestString);

        return this.requestString;
    }
};

export default GeocodeRequestREST;
