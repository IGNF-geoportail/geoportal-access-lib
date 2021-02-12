
import Logger from "../../Utils/LoggerByDefault";
import _ from "../../Utils/MessagesResources";
import ErrorService from "../../Exceptions/ErrorService";
import CommonService from "../CommonService";
import DefaultUrlService from "../DefaultUrlService";
import ProcessIsoCurveRequest from "./Request/ProcessIsoCurveRequest";
import ProcessIsoCurveResponseFactory from "./Response/ProcessIsoCurveResponseFactory";
import TileMatrixSet from "../AutoConf/Response/model/TileMatrixSet";

/**
 * @classdesc
 * Appel du service d'isochrone/distance du Géoportail :
 *     envoi de la requête construite selon les paramètres en options,
 *     éventuellement parsing et analyse  de la réponse,
 *     retour d'une réponse en paramètre de la fonction onSuccess.
 * @constructor
 * @extends {Gp.Services.CommonService}
 * @alias Gp.Services.ProcessIsoCurve
 * @param {Object} options - options spécifiques au service (+ les options heritées)
 * 
 * @param {String} options.resource - La ressource utilisée pour le calcul. Ce paramètre devrait être obligatoire car il l'est dans l'appel au service. Mais il ne l'est pas pour des raisons de rétrocompatibilité.
 *
 * @param {String} options.outputFormat - Le format de la réponse du service iso : 'json' uniquement et par défaut.
 *
 * @param {Object} options.position - Point de départ du calcul.
 *      Coordonnées exprimées en longitudes, latitudes (EPSG:4326)
 *      @param {Float} options.position.x - Abcisse du point de départ du calcul d'isochrone/distance.
 *      @param {Float} options.position.y - Ordonnée du point de départ du calcul d'isochrone/distance.
 *
 * @param {String} options.srs - Projection.
 *      Système de coordonnées dans lequel les coordonnées du point « location » sont exprimées et
 *      dans lequel la géométrie de la courbe résultante sera exprimée.
 *      Par défaut, le système de coordonnées utilisé sera « EPSG:4326 ».
 *
 * @param {String} [options.graph = "voiture"] - Nom du graphe à utiliser pour le calcul (« Pieton » ou « Voiture »).
 *      La valeur par défaut est : «voiture»
 *
 * @param {Array.<String>} [options.exclusions] - DEPRECATED: Ce paramètre est conservé pour une rétrocompatibilité de l'api. Le nouveau paramètre à utiliser est options.constraints.
 *      Critères d'exclusions à appliquer pour le calcul.
 *      On précise ici le type de tronçons que l'on ne veut pas que l'isochrone/distance emprunte
 *      (valeurs possibles : « toll » (éviter les péages), « bridge », « tunnel »).
 *
 * @param {Object[]} [options.constraints] - Critères de contraintes à appliquer sur un itinéraire. Les valeurs disponibles dépendent de la ressource utilisée. Il est donc utile de regarder le getCapabilities.
 *      @param {String} [options.constraints.constraintType] - Type de la contrainte. Généralement "banned".
 *      @param {String} [options.constraints.key] - Clé de la contrainte. Généralement "wayType".
 *      @param {String} [options.constraints.operator] - Opérateur de la contrainte. Généralement "=".
 *      @param {String} [options.constraints.value] - Valeur de la contrainte. Généralement "autoroute".
 * 
 * @param {String} [options.method = "time"] - Méthode utilisée pour le calcul de la courbe iso.
 *      Les valeurs possible sont "time" pour un calcul d'isochrone, "distance" pour un calcul d'isodistance.
 *      Pas de valeur spécifié équivaut à un calcul d'isochrone.
 * 
 * @param {String} [options.distanceUnit = "km"] - Indique si la distance doit être exprimée en km ou m dans la réponse ("m" or "km").
 * 
 * @param {String} [options.timeUnit = "standard"] - Indique si la durée doit être exprimée en seconde, minute ou heure dans la réponse ("standard", "second", "minute", "hour"). Il peut-être formatté hh:mm::ss avec la valeur standard.
 * 
 * @param {Float} options.time - Durée maximum (exprimée en secondes) à utiliser pour le calcul de la courbe à partir du ou jusqu'au point « location ».
 *      Ce paramètre doit être renseigné si l'option "méthod" a la valeur "time".
 *      Si l'option method n'est pas renseignée, ce paramètre doit être renseigné.
 *
 * @param {Float} options.distance - Distance maximum (exprimée en metres) à utiliser pour le calcul de la courbe à partir du ou j'usqu'au point « location ».
 *      Ce paramètre doit être renseigné si l'option "méthod" a la valeur "DISTANCE".
 *      Si l'option "method" n'est pas renseignée, ce paramètre sera ignoré.
 *
 * @param {Boolean} [options.reverse = false] - Indique si la géométrie résultante doit être lissée (« true ») pour ne pas avoir d'effet d'escalier.
 *      Par défaut, la valeur « false » est appliquée.
 *
 * @param {Boolean} [options.smoothing = false] - Indique si la géométrie résultante doit être lissée (« true ») pour ne pas avoir d'effet d'escalier.
 *      Par défaut, la valeur « false » est appliquée.
 *
 * @param {Boolean} [options.holes = false] - Indique si la géométrie résultante (surface) doit être retournée avec des trous (« true »).
 *      Par défaut, la valeur « false » est appliquée.
 *
 * @example
 *   var options = {
 *      // options communes aux services
 *      apiKey : null,
 *      serverUrl : 'http://localhost/service/',
 *      protocol : 'JSONP', // JSONP|XHR
 *      proxyURL : null,
 *      httpMethod : 'GET', // GET|POST
 *      timeOut : 10000, // ms
 *      rawResponse : false, // true|false
 *      scope : null, // this
 *      onSuccess : function (response) {},
 *      onFailure : function (error) {},
 *      // spécifique au service
 *      position : {
 *           x : 2.3242664298058053,
 *           y : 48.86118017324745
 *      },
 *      distance : 200,
 *      [time : ]
 *      method : "distance",
 *      graph : "voiture",
 *      reverse : false
 *  };
 * @private
 */

function ProcessIsoCurve (options) {
    if (!(this instanceof ProcessIsoCurve)) {
        throw new TypeError(_.getMessage("CLASS_CONSTRUCTOR", "ProcessIsoCurve"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "ProcessIsoCurve";

    // appel du constructeur par heritage
    CommonService.apply(this, arguments);

    this.logger = Logger.getLogger("Gp.Services.ProcessIsoCurve");
    this.logger.trace("[Constructeur ProcessIsoCurve (options)]");

    if (!options.position) {
        throw new Error(_.getMessage("PARAM_MISSING", "position"));
    }

    // on lance une exception afin d'eviter au service de le faire...
    if (options.position.x === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "position.x"));
    }

    if (options.position.y === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "position.y"));
    }

    if (!options.time && !options.distance) {
        throw new Error("Parameter (s) 'distance' missing. Parameter time to calculate an isochrone, parameter distance for an isodistance");
    }

    // si on a que le paramètre "distance" en entrée, on calcule une isodistance.
    // Le paramètre "méthode" doit pour avoir une réponse du service, être passé à "distance"
    if (!options.time && options.distance) {
        this.options.method = "distance";
        // on supprime l'éventuel attribut time, résidu d'un appel antérieur
        if (this.options.time) {
            delete this.options.time;
        }
    }

    // si on a que le paramètre "time" en entrée, on calcule une isochrone.
    // Le paramètre "méthode" doit pour avoir une réponse du service, être passé à "time"
    if (options.time && !options.distance) {
        this.options.method = "time";
        // on supprime l'éventuel attribut time, résidu d'un appel antérieur
        if (this.options.distance) {
            delete this.options.distance;
        }
    }

    // au cas où on a ni l'un, ni l'autre...
    this.options.method = this.options.method || "time";

    // options par defaut du service
    // TODO: modifier la ressource lors de la mise en production du service
    this.options.resource = options.resource || "bduni-idf-pgr";
    this.options.exclusions = options.exclusions || [];
    this.options.reverse = options.reverse || false;
    this.options.srs = options.srs || "EPSG:4326";
    this.options.distanceUnit = options.distanceUnit || "km";
    this.options.timeUnit = options.timeUnit || "standard";

    //options depreciees
    if (options.smoothing) {
        this.logger.warn("options.smoothing is DEPRECATED");
    } 
    this.options.smoothing = false;
    if (options.holes) {
        this.logger.warn("options.holes is DEPRECATED");
    } 
    this.options.holes = false;

    // Gestion du graphe
    if (options.graph) {
        if (options.graph === "Voiture") {
            this.options.graph = "car";
        }
        if (options.graph === "Pieton") {
            this.options.graph = "pedestrian";
        }
    } else {
        this.options.graph = "car";
    }

    // Gestions des contraintes 
    this.options.constraints = [];
    if (options.constraints) {
        if (Array.isArray(options.constraints)) {
            for (var k = 0; k < options.constraints.length; k++) {
                this.options.constraints.push(options.constraints[k]);
            }
        } else {
            throw new Error(_.getMessage("PARAM_TYPE", "constraints"));
        }
    }

    // Gestion de l'ancien paramètre exclusions
    var constraintTunnel = {};
    var constraintPont = {};
    var constraintAutoroute = {};
    if (options.exclusions) {
        if (options.exclusions.length !== 0) {
            this.logger.warn("options.exclusions is DEPRECATED !!");
            for(var c = 0; c < options.exclusions.length; c++) {
                if (typeof options.exclusions[c] === "string") {
                    options.exclusions[c] = options.exclusions[c].toLowerCase();
                } else {
                    // on ne crée pas une erreur pour rétro-compatibilité avec les anciennes versions
                    continue;
                }
                if (options.exclusions[c] === "toll") {
                    constraintAutoroute.constraintType = "banned";
                    constraintAutoroute.key = "wayType";
                    constraintAutoroute.operator = "=";
                    constraintAutoroute.value = "autoroute";
                    this.options.constraints.push(constraintAutoroute);
                }
                if (options.exclusions[c] === "tunnel") {
                    constraintTunnel.constraintType = "banned";
                    constraintTunnel.key = "wayType";
                    constraintTunnel.operator = "=";
                    constraintTunnel.value = "tunnel";
                    this.options.constraints.push(constraintTunnel);
                }
                if (options.exclusions[c] === "bridge") {
                    constraintPont.constraintType = "banned";
                    constraintPont.key = "wayType";
                    constraintPont.operator = "=";
                    constraintPont.value = "pont";
                    this.options.constraints.push(constraintPont);
                }
            }
        }
    }

    // on passe l'option outputFormat en minuscules afin d'éviter des exceptions.
    this.options.outputFormat = (typeof options.outputFormat === "string") ? options.outputFormat.toLowerCase() : "json";
    if (options.outputFormat && options.outputFormat !== "json") {
        throw new Error(_.getMessage("PARAM_NOT_SUPPORT", "outputFormat"));
    }
    this.options.outputFormat = "json";

    // gestion de l'url du service par defaut
    // si l'url n'est pas renseignée, il faut utiliser les urls par defaut
    if (!this.options.serverUrl) {
        var urlFound = DefaultUrlService.ProcessIsoCurve.url(this.options.apiKey);
        if (!urlFound) {
            throw new Error("Url by default not found !");
        }
        this.options.serverUrl = urlFound;
        this.logger.trace("Serveur URL par defaut : " + this.options.serverUrl);
    }

}

/**
 * @lends module:ProcessIsoCurve#
 */
ProcessIsoCurve.prototype = Object.create(CommonService.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
ProcessIsoCurve.prototype.constructor = ProcessIsoCurve;

/**
 * Création de la requête (overwrite)
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
ProcessIsoCurve.prototype.buildRequest = function (error, success) {
    try {
        var oIsoCurve = new ProcessIsoCurveRequest(this.options);
        if (!oIsoCurve.processRequestString()) {
            throw new Error(_.getMessage("SERVICE_REQUEST_BUILD"));
        }

        this.request = oIsoCurve.requestString;
    } catch (e) {
        error.call(this, new ErrorService(e.message));
        return;
    }

    success.call(this, this.request);
};

/**
 * (overwrite)
 * Analyse de la reponse
 *
 * @param {Function} onError   - callback des erreurs
 * @param {Function} onSuccess - callback de succès de l'analyse de la réponse
 */
ProcessIsoCurve.prototype.analyzeResponse = function (onError, onSuccess) {
    if (this.response) {
        var options = {
            response : this.response,
            outputFormat : this.options.outputFormat,
            rawResponse : this.options.rawResponse,
            onSuccess : onSuccess,
            onError : onError,
            scope : this
        };

        ProcessIsoCurveResponseFactory.build(options);
    } else {
        onError.call(this, new ErrorService(_.getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

export default ProcessIsoCurve;
