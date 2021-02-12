
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
function RouteParamREST (options) {
    if (!(this instanceof RouteParamREST)) {
        throw new TypeError("RouteParamREST constructor cannot be called as a function.");
    }

    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur RouteParamREST ()]");
    this.logger.trace(options.constraints);
    /**
     * Options en paramêtres du constructeur.
     */
    this.options = options || {};

    // mapping des options avec l'API REST

    /** Ressource utilisée */
    this.resource = this.options.resource;

    /** Coordonnées du point de départ. */
    this.start = this.options.startPoint.x + "," + this.options.startPoint.y;

    /** Coordonnées du point d’arrivée. */
    this.end = this.options.endPoint.x + "," + this.options.endPoint.y;

    /** Coordonnées des étapes point de départ. */
    this.intermediates = this.options.viaPoints;

    /** Nom du profile à utiliser */
    this.profile = this.options.graph;

    /** projection (code EPSG comme epsg:4326 ou wgs84) */
    this.crs = this.options.srs;

    /** Liste des contraintes */
    this.constraints = this.options.constraints;

    /** Nom de l'optimisation à utiliser */
    this.optimization = this.options.routePreference;

    /** Format de sortie (résumé de l’itinéraire) */
    this.getSteps = (this.options.geometryInInstructions) ? "true" : "false";

    /** Unité des distances */
    this.distanceUnit = this.options.distanceUnit;

    /** Unité des durées */
    this.timeUnit = this.options.timeUnit;

    /** Attributs des voies */
    this.waysAttributes = this.options.waysAttributes;
}

/**
 * CLASSNAME
 */
RouteParamREST.CLASSNAME = "RouteParamREST";

RouteParamREST.prototype = {

    /**
     * @lends module:RouteParamREST#
     */

    /**
     * Constructeur (alias)
     */
    constructor : RouteParamREST,

    /**
     * Retourne une liste de points
     * @returns {String} une liste de points (sep '|')
     */
    getIntermediates : function () {
        var array = [];
        if (this.intermediates.length !== 0) {
            for (var i = 0; i < this.intermediates.length; i++) {
                var obj = this.intermediates[i];
                array.push(obj.x + "," + obj.y);
            }
        }

        return array.join("|");
    },

    /**
     * Retourne une liste d'attributs
     * @returns {String} une liste d'attributs (sep '|')
     */
    getWaysAttributes : function () {
        return this.waysAttributes.join("|");
    },

    /**
     * Retourne un profile
     * @returns {String} profile
     */
    getProfile : function () {
        return this.profile;
    },

    /**
     * Retourne un distanceUnit
     * @returns {String} distanceUnit
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
     * Retourne une optimisation
     * @returns {String} optimization
     */
    getOptimization : function () {
        if (this.optimization) {
            return this.optimization;
        } else {
            return "";
        }
    },

    /**
     * Retourne la liste des constraints
     * @returns {String} une liste des constraints (sep '|')
     */
    getConstraints : function () {
        var constraintArray = [];

        if (this.constraints.length !== 0) {
            for (var k = 0; k < this.constraints.length; k++) {
                constraintArray.push(JSON.stringify(this.constraints[k]));
            }
        }
        return constraintArray.join("|");
    }
};

/**
 * Tableau de clefs/valeurs pour param.
 *
 * @returns {Array} liste de paramêtres
 */
RouteParamREST.prototype.getParams = function () {
    var map = [];

    map.push({
        k : "resource",
        v : this.resource
    });

    map.push({
        k : "start",
        v : this.start
    });

    map.push({
        k : "end",
        v : this.end
    });

    map.push({
        k : "geometryFormat",
        v : "geojson"
    });

    if (this.optimization) {
        map.push({
            k : "optimization",
            v : this.getOptimization()
        });
    }

    if (this.intermediates) {
        map.push({
            k : "intermediates",
            v : this.getIntermediates()
        });
    }

    if (this.profile) {
        map.push({
            k : "profile",
            v : this.getProfile()
        });
    }

    if (this.constraints) {
        map.push({
            k : "constraints",
            v : this.getConstraints()
        });
    }

    if (this.crs) {
        map.push({
            k : "crs",
            v : this.crs
        });
    }

    if (this.distanceUnit) {
        map.push({
            k : "distanceUnit",
            v : this.getDistanceUnit()
        });
    }

    if (this.timeUnit) {
        map.push({
            k : "timeUnit",
            v : this.timeUnit
        });
    }

    if (this.waysAttributes) {
        map.push({
            k : "waysAttributes",
            v : this.getWaysAttributes()
        });
    }

    return map;
};

export default RouteParamREST;
