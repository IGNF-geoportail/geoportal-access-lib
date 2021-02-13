/**
 * Fonction retournant un objet contenant des clés de lecture (readers)
 *      qui permettent de parser des réponses XML du service de géocodage direct du Géoportail
 *      afin de récupérer les résultats retournés.
 * @module GeocodeResponseParser
 * @alias Gp.Services.Geocode.Formats.GeocodeResponseParser
 * @private
 */

// import Logger from "../../../Utils/LoggerByDefault";
import MR from "../../../Utils/MessagesResources";
import ErrSrv from "../../../Exceptions/ErrorService";
import GeocodeResponse from "../Response/model/GeocodeResponse";
import GeocodedLocation from "../Response/model/GeocodedLocation";

/**
 * @classdesc
 *
 * Classe permettant de parser une réponse GeoJSON
 *
 * @constructor
 * @alias Gp.Formats.GeocodeResponseParser
 *
 * @private
 */
function GeocodeResponseParser () {
    if (!(this instanceof GeocodeResponseParser)) {
        throw new TypeError("GeocodeResponseParser constructor cannot be called as a function.");
    }
}

GeocodeResponseParser.prototype = {

    /**
     * @lends module:GeocodeResponseParser
     */

    /*
     * Constructeur (alias)
     */
    constructor : GeocodeResponseParser,

    /**
     * Méthode permettant de lancer la lecture d'une réponse GeoJSON,
     *
     * @param {String} json - réponse au format GeoJSON
     * @return {Object} geocodeResponse|exceptionReport : l'objet contenant les informations de la réponse GeoJSON,
     *      sous la forme d'un objet GeocodeResponse, ou un objet littéral exceptionReport si le service a renvoyé une exception.
     */
    parse : function (json) {
        var geocodeResponse = new GeocodeResponse();

        const obj = JSON.parse(json);

        if (obj.type === "FeatureCollection") {
            for (var i = 0; i < obj.features.length; ++i) {
                _parseFeature(obj.features[i], geocodeResponse);
            }
        } else if (obj.type === "Feature") {
            _parseFeature(obj, geocodeResponse);
        } else if (obj.type === "SERVICE_ERROR") {
            return _parseError(obj);
        } else {
            var mess = MR.getMessage("SERVICE_RESPONSE_ANALYSE", obj.type);
            throw new ErrSrv({
                message : mess,
                type : ErrSrv.TYPE_UNKERR,
                status : 200
            });
        }

        return geocodeResponse;
    }
};

/**
 * Méthode permettant de parser un feature
 *
 * @private
 *
 * @param {Object} feature
 * @param {Object} geocodeResponse
 *
 * @memberof GeocodeResponseParser
 * @return {Object} objet GeocodedLocation
 */
function _parseFeature (feature, geocodeResponse) {
    var location = new GeocodedLocation();
    if (feature.geometry && feature.geometry.type === "Point") {
        location.position = {
            lon : feature.geometry.coordinates[0],
            lat : feature.geometry.coordinates[1]
        };
    }
    if (feature.properties) {
        for (var prop in feature.properties) {
            if (prop === "_score") {
                location.accuracy = feature.properties[prop];
            } else if (prop === "_type") {
                if (feature.properties[prop] === "address") {
                    location.type = "StreetAddress";
                } else if (feature.properties[prop] === "poi") {
                    location.type = "PositionOfInterest";
                } else if (feature.properties[prop] === "parcel") {
                    location.type = "CadastralParcel";
                }
            } else {
                location.placeAttributes[prop] = feature.properties[prop];
            }
        }
        if (feature.properties._type === "address") {
            location.matchType = feature.properties.number !== undefined && feature.properties.number !== null ? "street number" : "street";
        }
    }
    geocodeResponse.locations.push(location);
}

/**
 * Méthode permettant de parser une erreur
 *
 * @private
 *
 * @param {Object} error
 *
 * @memberof GeocodeResponseParser
 * @return {Object}
 */
function _parseError (error) {
    return {
        exceptionReport : error
    };
}

export default GeocodeResponseParser;
