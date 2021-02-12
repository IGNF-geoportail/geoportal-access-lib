
import Logger from "../../Utils/LoggerByDefault";
import _ from "../../Utils/MessagesResources";
import ErrorService from "../../Exceptions/ErrorService";
import CommonService from "../CommonService";
import DefaultUrlService from "../DefaultUrlService";
import RouteRequestFactory from "./Request/RouteRequestFactory";
import RouteResponseFactory from "./Response/RouteResponseFactory";

/**
 * @classdesc
 * Appel du service d'itinéraire du Géoportail :
 *     envoi de la requête construite selon les paramètres en options,
 *     éventuellement parsing et analyse  de la réponse,
 *     retour d'une réponse en paramètre de la fonction onSuccess.
 *
 * @alias Gp.Services.Route
 * @constructor
 * @extends {Gp.Services.CommonService}
 * @param {Object} options - options spécifiques au service (+ les options heritées)
 *
 * @param {String} options.resource - La ressource utilisée pour le calcul. Ce paramètre devrait être obligatoire car il l'est dans l'appel au service. Mais il ne l'est pas pour des raisons de rétrocompatibilité.
 *
 * @param {String} options.outputFormat - Le format de la réponse du service itineraire : 'json' uniquement et par défaut.
 *
 * @param {String} [options.routePreference = "fastest"] - Mode de calcul à utiliser :
 * - le plus rapide « fastest »
 * - le plus court « shortest »
 * Par défaut : « fastest ».
 *
 * @param {Object} options.startPoint - Point de départ du calcul. Coordonnées exprimées en longitudes, latitudes (EPSG:4326)
 * @param {Float} options.startPoint.x - Abcisse du point de départ du calcul d'itinéraire.
 * @param {Float} options.startPoint.y - Ordonnée du point de départ du calcul d'itinéraire.
 *
 * @param {Object} options.endPoint - Point d'arrivée du calcul. Coordonnées exprimées en longitudes, latitudes (EPSG:4326)
 * @param {Float} options.endPoint.x - Abcisse du point d'arrivée du calcul d'itinéraire.
 * @param {Float} options.endPoint.y - Ordonnée du point d'arrivée du calcul d'itinéraire.
 *
 * @param {Object[]} [options.viaPoints] - Liste de point ({x:Float,y:Float}) intermédaires que l'itinéraire doit emprunter dans l'ordre du tableau.
 *      Coordonnées exprimées en longitudes, latitudes (EPSG:4326) :{x:float, y:float}
 *
 * @param {String} [options.graph = "voiture"] - Type de graphe utilisé : "Voiture" ou "Pieton".
 *      Détermine le profil de vitesses utilisé pour le calcul ainsi que les tronçons autorisés ou non.
 *      Par défaut, c'est la valeur "Voiture" qui sera utilisée.
 *
 * @param {String[]} [options.exclusions] - DEPRECATED: Critères d'exclusions à appliquer pour le calcul. (correspond au paramètre "avoidFeature" d'OpenLS)
 *      On précise ici le type de tronçons que l'on ne veut pas que l'itinéraire emprunte
 *      (valeurs possibles : « toll » (éviter les péages), « bridge », « tunnel »).
 *      Ce paramètre est conservé pour une rétrocompatibilité de l'api. Le nouveau paramètre à utiliser est options.constraints
 *
 * @param {Object[]} [options.constraints] - Critères de contraintes à appliquer sur un itinéraire. Les valeurs disponibles dépendent de la ressource utilisée. Il est donc utile de regarder le getCapabilities.
 * @param {String} [options.constraints.constraintType] - Type de la contrainte. Généralement "banned".
 * @param {String} [options.constraints.key] - Clé de la contrainte. Généralement "wayType".
 * @param {String} [options.constraints.operator] - Opérateur de la contrainte. Généralement "=".
 * @param {String} [options.constraints.value] - Valeur de la contrainte. Généralement "autoroute".
 *
 * @param {Boolean} [options.geometryInInstructions = false] - Indique si la géométrie de l'itinéraire doit être reprise morceau par morceau dans les instructions.
 *      (correspond au paramètre "provideGeometry" d'OpenLS) Par défaut : false.
 *
 * @param {Boolean} [options.provideBbox = true] - Indique si les instructions doivent être localisées par une bbox dans la réponse.
 *      Par défaut : true.
 *
 * @param {String} [options.distanceUnit = "km"] - Indique si la distance doit être exprimée en km ou m dans la réponse.
 *      Par défaut : km.
 * @param {String} [options.timeUnit = "standard"] - Indique si la durée doit être exprimée en seconde, minute ou heure dans la réponse. Il peut-être formatté hh:mm::ss avec la valeur standard.
 *      Les valeurs possibles sont "standard", "second", "minute" ou "hour".
 *      Par défaut : "standard".
 *
 * @param {String} [options.srs] - Système de coordonnées dans lequel les paramètres géographiques en entrée et la réponse du service sont exprimés.
 *      Pas de valeur par défaut. Si le serveur consulté est celui du Géoportail, la valeur par défaut sera donc celle du service : 'EPSG:4326'.
 *
 * @param {String[]} [options.waysAttributes] - Nom des attributs des voies. Les valeurs disponibles dépendent de la ressource utilisée. Il est donc utile de regarder le getCapabilities.
 *
 * @example
 *  var options = {
 *      // options communes aux services
 *      apiKey : null,
 *      serverUrl : 'http://localhost/service/',
 *      protocol : 'XHR',
 *      proxyURL : null,
 *      httpMethod : 'GET', // GET|POST
 *      timeOut : 10000, // ms
 *      rawResponse : false, // true|false
 *      scope : null, // this
 *      onSuccess : function (response) {},
 *      onFailure : function (error) {},
 *      // spécifique au service
 *      resource : 'bdtopo'
 *      outputFormat : 'json',
 *      startPoint : {
 *          x : 42.1121,
 *          y : 1.5557
 *      },
 *      endPoint : {
 *          x : 42.1121,
 *          y : 1.5557
 *      },
 *      provideBbox : true,
 *      exclusions : ["Bridge", "Tunnel", "Toll"],
 *      distanceUnit : "km",
 *      graph : "Voiture",
 *      geometryInInstructions : true,
 *      routePreference : "fastest"
 *  };
 *
 * @private
 */
function Route (options) {
    if (!(this instanceof Route)) {
        throw new TypeError(_.getMessage("CLASS_CONSTRUCTOR", "Route"));
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "Route";

    // appel du constructeur par heritage
    CommonService.apply(this, arguments);

    this.logger = Logger.getLogger("Gp.Services.Route");
    this.logger.trace("[Constructeur Route (options)]");

    if (!options.startPoint) {
        throw new Error(_.getMessage("PARAM_MISSING", "startPoint"));
    }

    // on lance une exception afin d'eviter au service de le faire...
    if (options.startPoint.x === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "startPoint.x"));
    }

    if (options.startPoint.y === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "startPoint.y"));
    }

    if (!options.endPoint) {
        throw new Error(_.getMessage("PARAM_MISSING", "endPoint"));
    }

    // on lance une exception afin d'eviter au service de le faire...
    if (options.endPoint.x === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "endPoint.x"));
    }

    if (options.endPoint.y === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "endPoint.y"));
    }

    // options par defaut

    // on passe l'option outputFormat en minuscules afin d'éviter des exceptions.
    if (options.outputFormat && options.outputFormat !== "json") {
        this.logger.warn("options.outputFormat could only be json");
    }
    this.options.outputFormat = "json";
    
    this.options.resource = options.resource || "bduni-idf-osrm";
    this.options.startPoint = options.startPoint;
    this.options.endPoint = options.endPoint;
    this.options.viaPoints = options.viaPoints || [];
    this.options.routePreference = options.routePreference || "fastest";
    /** Gestion des anciennes valeurs de graph */
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

    /** Gestion de l'ancien paramètre exclusion */
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

    this.options.geometryInInstructions = options.geometryInInstructions || false;
    this.options.provideBbox = options.provideBbox || true;
    this.options.distanceUnit = options.distanceUnit || "km";
    this.options.timeUnit = options.timeUnit || "standard";
    this.options.expectedStartTime = null; // FIXME not yet implemented !
    this.options.srs = options.srs || "EPSG:4326";
    this.options.waysAttributes = options.waysAttributes || [];

    // gestion de l'url du service par defaut
    // si l'url n'est pas renseignée, il faut utiliser les urls par defaut
    if (!this.options.serverUrl) {
        var UrlByDefault = DefaultUrlService.Route.url(this.options.apiKey);
        if (!UrlByDefault) {
            throw new Error("Url by default not found !");
        }
        this.options.serverUrl = UrlByDefault;
        this.logger.trace("Serveur URL par defaut : " + this.options.serverUrl);
    }
}

/**
 * @lends module:Route#
 */
Route.prototype = Object.create(CommonService.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
Route.prototype.constructor = Route;

/**
 * (overwrite)
 * Création de la requête
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
Route.prototype.buildRequest = function (error, success) {
    var options = {
        // spécifique au service
        resource : this.options.resource,
        startPoint : this.options.startPoint,
        endPoint : this.options.endPoint,
        viaPoints : this.options.viaPoints,
        provideBbox : this.options.provideBbox,
        constraints : this.options.constraints,
        distanceUnit : this.options.distanceUnit,
        timeUnit : this.options.timeUnit,
        graph : this.options.graph,
        geometryInInstructions : this.options.geometryInInstructions,
        routePreference : this.options.routePreference,
        srs : this.options.srs,
        waysAttributes : this.options.waysAttributes
    };

    this.request = RouteRequestFactory.build(options);

    // on teste si la requete a bien été construite !
    if (!this.request) {
        error.call(this, new ErrorService(_.getMessage("SERVICE_REQUEST_BUILD")));
    } else {
        success.call(this, this.request);
    }
};

/**
 * (overwrite)
 * Analyse de la reponse
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
Route.prototype.analyzeResponse = function (error, success) {
    // INFO
    // Factory pour masquer la complexité du retour du service

    if (this.response) {
        var options = {
            distanceUnit : this.options.distanceUnit,
            timeUnit : this.options.timeUnit,
            response : this.response,
            outputFormat : this.options.outputFormat, // utile pour parser la string en mode XHR : JSON ou XML !
            rawResponse : this.options.rawResponse,
            onError : error,
            onSuccess : success,
            scope : this
        };

        RouteResponseFactory.build(options);
    } else {
        error.call(this, new ErrorService(_.getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

export default Route;
