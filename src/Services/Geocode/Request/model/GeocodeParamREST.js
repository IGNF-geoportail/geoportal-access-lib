
import Logger from "../../../../Utils/LoggerByDefault";

/**
 * @classdesc
 * Classe de gestion des param. des requêtes du service de calcul d'itineraire (REST).
 *      Permet le mapping avec les options du service.
 * @constructor
 * @alias Gp.Services.Route.Request.RouteParamREST
 * @param {Object} options - options
 *
 * @private
 */
function GeocodeParamREST (options) {
    if (!(this instanceof GeocodeParamREST)) {
        throw new TypeError("GeocodeParamREST constructor cannot be called as a function.");
    }

    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur GeocodeParamREST ()]");

    /**
     * Options en paramêtres du constructeur.
     */
    this.options = options || {};

    // methode de geocodage
    if (!this.options.geocodeMethod || (this.options.geocodeMethod !== "search" && this.options.geocodeMethod !== "reverse")) {
        throw new Error("Error geocodeMethod not valid");
    }
    this.geocodeMethod = this.options.geocodeMethod;

    // mapping des options avec l'API REST
    this.query = (typeof this.options !== "undefined") ? this.options.query : null;

    this.searchGeometry = this.options.searchGeometry || null;

    this.index = this.options.index || null;

    this.lon = this.options.position && this.options.position.lon ? this.options.position.lon : null;

    this.lat = this.options.position && this.options.position.lat ? this.options.position.lat : null;

    this.maxResp = this.options.maximumResponses || null;

    this.returnTrueGeometry = this.options.returnTrueGeometry || null;

    this.filters = this.options.filters || {};
}

/**
 * CLASSNAME
 */
GeocodeParamREST.CLASSNAME = "GeocodeParamREST";

GeocodeParamREST.prototype = {

    /**
     * @lends module:GeocodeParamREST#
     */

    /**
     * Constructeur (alias)
     */
    constructor : GeocodeParamREST,

    /**
     * Retourne le paramètre lonlat
     * @returns {String} Le paramètre lonlat
     */
    getLonlat : function () {
        if (!this.lon || !this.lat) {
            return null;
        }

        return this.lon + "," + this.lat;
    },

    /**
     * Retourne les filtres
     * @returns {String} les filtres
     */
    getFilters : function () {
        var filters = {};
        for (var prop in this.filters) {
            if (this.filters.hasOwnProperty(prop)) {
                filters["filters[" + prop + "]"] = this.filters[prop];
            }
        }
        return filters;
    },

    /**
     * Retourne l'index
     * @returns {String} l'index
     */
    getIndex : function () {
        if (this.index === undefined) {
            return null;
        }
        if (this.index === "StreetAddress") {
            return "address";
        } else if (this.index === "CadastralParcel") {
            return "parcel";
        } else if (this.index === "PositionOfInterest") {
            return "poi";
        } else if (this.index === "location") {
            return "location";
        }
        return this.index;
    },

    /**
     * Retourne la géométrie de recherche
     * @returns {String} la géométrie de recherche au format json
     */
    getSearchGeometry : function () {
        return JSON.stringify(this.searchGeometry);
    }
};

/**
 * Tableau de clefs/valeurs pour param.
 *
 * @returns {Array} liste de paramêtres
 */
GeocodeParamREST.prototype.getParams = function () {
    var map = [];

    if (this.geocodeMethod === "search") {
        map.push({
            k : "q",
            v : this.query
        });
    }

    if (this.geocodeMethod === "reverse") {
        map.push({
            k : "searchGeom",
            v : this.getSearchGeometry()
        });
    }

    if (this.lon && this.lat) {
        map.push({
            k : "lonlat",
            v : this.getLonlat()
        });
    }

    if (this.maxResp) {
        map.push({
            k : "maxResp",
            v : this.maxResp
        });
    }

    if (this.returnTrueGeometry) {
        map.push({
            k : "returnTrueGeometry",
            v : this.returnTrueGeometry
        });
    }

    const filters = this.getFilters();
    for (var key in filters) {
        map.push({
            k : key,
            v : filters[key]
        });
    }

    return map;
};

export default GeocodeParamREST;
