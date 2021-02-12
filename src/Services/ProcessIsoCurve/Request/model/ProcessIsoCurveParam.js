
import Logger from "../../../../Utils/LoggerByDefault";

/**
 * @classdesc
 *
 * Classe de gestion des param. des requêtes du service de calcul des iso.
 * Permet le mapping avec les options du service.
 *
 * @constructor
 * @alias Gp.Services.ProcessIsoCurve.Request.ProcessIsoCurveParam
 * @param {Object} options - options
 * @private
 *
 */
function ProcessIsoCurveParam (options) {
    if (!(this instanceof ProcessIsoCurveParam)) {
        throw new TypeError("ProcessIsoCurveParam constructor cannot be called as a function.");
    }

    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur ProcessIsoCurveParam ()]");

    /**
     * Options en paramêtres du constructeur.
     */
    this.options = options || {};

    // mapping des options avec l'API REST

    /** Identifiant de l’isochrone */
    this.id = this.options.id;

    /** Resource */ 
    this.resource = this.options.resource;

    /** Coordonnées de départ (ou arrivée si le reverse est à true). */
    this.point = this.options.position;

    /** projection (code EPSG comme epsg:4326 ou wgs84) */
    this.crs = this.options.srs;

    /**
     * Profil de véhicule à utiliser pour le calcul.
     * Voiture ou Pieton
     */
    this.profile = this.options.graph;

    /** Liste des règles de restrictions à utiliser */
    this.constraints = this.options.constraints;

    this.reverse = this.options.reverse;

    this.timeUnit = this.options.timeUnit;

    this.distanceUnit = this.options.distanceUnit;

    /**
     * "time" pour isochrone ou "distance" for isodistance.
     * Par defaut, time...
     */
    if (this.options.method === "distance") {
        this.costType = "distance";
        this.costValue = this.options.distance;
    } else {
        this.costType = "time";
        this.costValue = this.options.time;
    }
}

/**
 * CLASSNAME
 */
ProcessIsoCurveParam.CLASSNAME = "ProcessIsoCurveParam";

ProcessIsoCurveParam.prototype = {

    /**
     * @lends module:ProcessIsoCurveParam#
     */

    /**
     * Constructeur (alias)
     */
    constructor : ProcessIsoCurveParam,

    /**
     * Retourne le point
     * @returns {String} x,y
     */
    getLocation : function () {
        return this.point.x + "," + this.point.y;
    },

    /**
     * Retourne l'unité de la distance
     * @returns {String} 
     */
    getDistanceUnit : function () {
        if (this.distanceUnit === "m") {
            return "meter";
        }
        if (this.distanceUnit === "km") {
            return "kilometer";
        }
        return "";
    },

    /**
     * Retourne la liste des contraintes
     * @returns {String} 
     */
    getConstraints : function () {
        var constraintArray = [];

        if (this.constraints.length !== 0) {
            for (var k = 0; k < this.constraints.length; k++) {
                constraintArray.push(JSON.stringify(this.constraints[k]));
            }
        }
        return constraintArray.join("|");
    },

    /**
     * Retourne la direction
     * @returns {String} 
     */
    getDirection : function () {
        if (this.reverse) {
            return "arrival";
        } else {
            return "departure";
        }
    }
};

/**
 * Tableau de clefs/valeurs pour param.
 *
 * @returns {Object[]} KVP
 */
ProcessIsoCurveParam.prototype.getParams = function () {
    var map = [];

    map.push({
        k : "resource",
        v : this.resource
    });

    map.push({
        k : "point",
        v : this.getLocation()
    });

    map.push({
        k : "direction",
        v : this.getDirection()
    });

    map.push({
        k : "costType",
        v : this.costType
    });

    map.push({
        k : "costValue",
        v : this.costValue
    });

    map.push({
        k : "profile",
        v : this.profile
    });

    map.push({
        k : "timeUnit",
        v : this.timeUnit
    });

    map.push({
        k : "distanceUnit",
        v : this.getDistanceUnit()
    });

    if (this.crs) {
        map.push({
            k : "crs",
            v : this.crs
        });
    }

    if (this.constraints) {
        map.push({
            k : "constraints",
            v : this.getConstraints()
        });
    }

    return map;
};

export default ProcessIsoCurveParam;
