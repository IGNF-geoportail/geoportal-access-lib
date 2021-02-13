import Logger from "../../Utils/LoggerByDefault";
import _ from "../../Utils/MessagesResources";
import ErrorService from "../../Exceptions/ErrorService";
import CommonService from "../CommonService";
import GeocodeRequestFactory from "./Request/GeocodeRequestFactory";
import GeocodeResponseFactory from "./Response/GeocodeResponseFactory";

/**
 * @classdesc
 * Appel du service de géocodage inverse du Géoportail :
 *     envoi de la requête construite selon les paramètres en options,
 *     éventuellement parsing et analyse  de la réponse,
 *     retour d'une réponse en paramètre de la fonction onSuccess.
 * @constructor
 * @extends {Gp.Services.CommonService}
 * @alias Gp.Services.ReverseGeocode
 *
 * @param {Object} options - options spécifiques au service (+ les options heritées)
 *
 * @param {Object} options.position - Position du point de référence pour le calcul de proximité exprimée dans le système de référence spécifié par le srs.
 *      @param {Float} options.position.lon - Longitude du point de référence pour le calcul de proximité.
 *      @param {Float} options.position.lat - Latitude du point de référence pour le calcul de proximité.
 *
 * @param {Object} [options.filters] - Les propriétés possibles de cet objet.
 * @param {String} [options.filters.[proprietes du filtre]] - Critère supplémentaire pour filtrer la recherche sous la forme
 *      d'un couple clé/valeur à définir selon les possibilités du serveur ajouté à la requête.
 *      Le service de géocodage du Géoportail permet de filtrer les adresses postales avec les propriétés :
 *          "postalCode", "inseeCode", "city".
 *      Il permet également de filtrer les toponymes avec les propriétés :
 *          "postalCode", "inseeCode", "type".
 *      Enfin, il permet de filtrer les parcelles cadastrales avec les propriétés :
 *          "codeDepartement", "codeCommune", "nomCommune", "codeCommuneAbs", "codeArrondissement", "section", "numero", "feuille".
 *
 * @param {Object} [options.searchGeometry] - Emprise dans laquelle on souhaite effectuer la recherche.
 *      Les propriétés possibles de cet objet sont décrites ci-après.
 *      @param {String} options.searchGeometry.type   - Type de géometrie (Point|Circle|Linestring|Polygon)
 *      @param {Array.<Float>|Array.Array.<Float>} options.searchGeometry.coordinates - Coordonnées des points constituant la géométrie.
 *      @param {Float} options.searchGeometry.radius    - Rayon. Paramètre applicable uniquement pour le type 'Circle'.
 *
 * @param {String} [options.index = "StreetAddress"] - Type de l'objet recherché.
 *      Le service de géocodage du Géoportail permet de rechercher des 'PositionOfInterest' pour des toponymes, des 'StreetAddress'
<<<<<<< HEAD
 *      pour des adresses postales ou des 'CadastralParcel' pour des parcelles cadastrales. L'index 'location' permet une recherche
 *      multi-indexes en regroupant les indexes 'PositionOfInterest' et 'StreetAddress'.
=======
 *      pour des adresses postales ou des 'CadastralParcel' pour des parcelles cadastrales.
 *      L'index 'location' regroupe les indexes 'StreetAddress' et 'PositionOfInterest'.
>>>>>>> 7e7c74ead3f22e15fb999397e1722641861dbe6d
 *      D'autres types pourront être rajoutés selon l'évolution du service.
 *      Par défaut, index = 'StreetAddress'.
 *
 * @param {Number} [options.maximumResponses] - Nombre de réponses maximal que l'on souhaite recevoir.
 *      Pas de valeur par défaut. Si le serveur consulté est celui du Géoportail, la valeur par défaut sera donc celle du service : 20s.
 *
 * @param {Boolean} [options.returnTrueGeometry] - Booléen indiquant si l'on souhaite récupérer la géométrie vraie des objects géolocalisés.
 *      false par défaut.
 *
 * @example
 *   var options = {
 *      apiKey : null,
 *      serverUrl : 'http://localhost/service/',
 *      proxyURL : null,
 *      timeOut : 10000, // ms
 *      rawResponse : false, // true|false
 *      scope : null, // this
 *      onSuccess : function (response) {},
 *      onFailure : function (error) {},
 *      // spécifique au service
 *      index : 'StreetAddress',
 *      searchGeometry : {
 *          type : Circle,
 *          coordinates : [48, 2],
 *          radius : 100
 *      },
 *      position : {lon:2 , lat:48.5},
 *      maximumResponses : 25,
 *   };
 *
 * @private
 */
function ReverseGeocode (options_) {
    if (!(this instanceof ReverseGeocode)) {
        throw new TypeError(_.getMessage("CLASS_CONSTRUCTOR", "ReverseGeocode"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "ReverseGeocode";

    this.logger = Logger.getLogger("Gp.Services.ReverseGeocode");
    this.logger.trace("[Constructeur ReverseGeocode (options)]");

    var options = this.patchOptionConvertor(options_);
    options.serverUrl = options.serverUrl || "https://geocodage.ign.fr/look4";

    // appel du constructeur par heritage
    CommonService.apply(this, [options]);

    if (!options.searchGeometry) {
        throw new Error(_.getMessage("PARAM_MISSING", "searchGeometry"));
    }

    // ajout des options spécifiques au service
    this.options.searchGeometry = options.searchGeometry;

    // on definit l'index par defaut
    if (!options.index) {
        this.options.index = options.index = "StreetAddress";
    }

    if (options.filters) {
        var filter = Object.keys(options.filters);
        for (var i = 0; i < filter.length; i++) {
            var key = filter[i];
            // on supprime les filtres vides
            if (typeof options.filters[key] === "undefined" ||
                (typeof options.filters[key] === "object" && Object.keys(options.filters[key]).length === 0) ||
                (typeof options.filters[key] === "string" && options.filters[key].length === 0) ||
                (Array.isArray(options.filters[key]) && options.filters[key].length === 0)
            ) {
                delete this.options.filters[key];
            }
        }
    }

    this.options.position = options.position;
    this.options.index = options.index || "StreetAddress";
    this.options.maximumResponses = options.maximumResponses || 20;
}

/**
 * @lends module:ReverseGeocode#
 */
ReverseGeocode.prototype = Object.create(CommonService.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
ReverseGeocode.prototype.constructor = ReverseGeocode;

/**
 * Patch pour la convertion des options vers le nouveau formalisme.
 *
 * @param {Object} options_ - options du service
 * @return {Object} - options
 */
ReverseGeocode.prototype.patchOptionConvertor = function (options_) {
    var options = options_;

    if (options.filterOptions) {
        this.logger.warn("The parameter 'filterOptions' is deprecated");

        if (options.filterOptions.type) {
            this.logger.warn("The parameter 'filterOptions.type' is deprecated");
            if (!options.index) {
                if (Array.isArray(options.filterOptions.type) && options.filterOptions.type.length > 0) {
                    options.index = options.filterOptions.type[0];
                } else {
                    options.index = options.filterOptions.type;
                }
            }
            delete options.filterOptions.type;
        }

        if (options.filterOptions.bbox) {
            this.logger.warn("The parameter 'filterOptions.bbox' is deprecated");
            if (!options.searchGeometry) {
                // convertir la geometrie
                options.searchGeometry = this.bbox2Json(options.filterOptions.bbox);
            }
            delete options.filterOptions.bbox;
        }

        if (options.filterOptions.circle) {
            this.logger.warn("The parameter 'filterOptions.circle' is deprecated");
            if (!options.searchGeometry) {
                // convertir la geometrie
                options.searchGeometry = this.circle2Json(options.filterOptions.circle);
            }
            delete options.filterOptions.circle;
        }

        if (options.filterOptions.polygon) {
            this.logger.warn("The parameter 'filterOptions.polygon' is deprecated");
            if (!options.searchGeometry) {
                // convertir la geometrie
                options.searchGeometry = this.polygon2Json(options.filterOptions.polygon);
            }
            delete options.filterOptions.polygon;
        }

        if (!options.filters && Object.keys(options.filterOptions).length > 0) {
            options.filters = options.filterOptions;
        }

        delete options.filterOptions;
    }

    if (options.position) {
        if (options.position.x) {
            this.logger.warn("The parameter 'position.x' is deprecated");

            if (!options.position.lon) {
                options.position.lon = options.position.x;
            }
            delete options.position.x;
        }

        if (options.position.y) {
            this.logger.warn("The parameter 'position.y' is deprecated");

            if (!options.position.lat) {
                options.position.lat = options.position.y;
            }
            delete options.position.y;
        }
    }

    if (options.srs) {
        this.logger.warn("The parameter 'srs' is deprecated");
        delete options.srs;
    }

    return options;
};

/**
 * (overwrite)
 * Création de la requête
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
ReverseGeocode.prototype.buildRequest = function (error, success) {
    var options = {
        httpMethod : this.options.httpMethod,
        // options specifiques du service
        geocodeMethod : "reverse",
        searchGeometry : this.options.searchGeometry,
        index : this.options.index,
        position : this.options.position,
        returnTrueGeometry : this.options.returnTrueGeometry,
        maximumResponses : this.options.maximumResponses,
        filters : this.options.filters
    };

    this.request = GeocodeRequestFactory.build(options);

    // on teste si la requete a bien été construite !
    (!this.request)
        ? error.call(this, new ErrorService(_.getMessage("SERVICE_REQUEST_BUILD")))
        : success.call(this, this.request);
};

/**
 * (overwrite)
 * Analyse de la reponse
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
ReverseGeocode.prototype.analyzeResponse = function (error, success) {
    if (this.response) {
        var options = {
            response : this.response,
            rawResponse : this.options.rawResponse,
            onError : error,
            onSuccess : success,
            scope : this
        };

        GeocodeResponseFactory.build(options);
    } else {
        error.call(this, new ErrorService(_.getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

/**
 * Patch pour la convertion des options vers le nouveau formalisme.
 *
 * @param {Array} bbox - bbox
 * @return {Object} - geometrie au format json
 */
ReverseGeocode.prototype.bbox2Json = function (bbox) {
    return {
        type : "Polygon",
        coordinates : [[
            [bbox.left, bbox.top],
            [bbox.right, bbox.top],
            [bbox.right, bbox.bottom],
            [bbox.left, bbox.bottom],
            [bbox.left, bbox.top]
        ]]
    };
};

/**
 * Patch pour la convertion des options vers le nouveau formalisme.
 *
 * @param {Object} circle - circle
 * @return {Object} - geometrie au format json
 */
ReverseGeocode.prototype.circle2Json = function (circle) {
    return {
        type : "Circle",
        radius : circle.radius,
        coordinates : [circle.x, circle.y]
    };
};

/**
 * Patch pour la convertion des options vers le nouveau formalisme.
 *
 * @param {Array} polygon - polygon
 * @return {Object} - geometrie au format json
 */
ReverseGeocode.prototype.polygon2Json = function (polygon) {
    var jsonGeom = {
        type : "Polygon",
        coordinates : [[]]
    };

    for (var i = 0; i < polygon.length; ++i) {
        jsonGeom.coordinates[0].push([polygon[i].x, polygon[i].y]);
    }

    return jsonGeom;
};

/**
 * Codes EPSG géographiques (lat/lon). Utiles car les coordonnées doivent être inversées.
 */
ReverseGeocode.geoEPSG = ["EPSG:4326"];

export default ReverseGeocode;
