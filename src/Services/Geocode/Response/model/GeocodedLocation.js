
/**
 * Single location object returned by the underlying geocoding web service.
 *
 * @property {Gp.Point} position - Position of the location given in the requested coordinates system.
 * @property {String} type - location type "StreetAddress" (for an address), "PositionOfInterest" (for a place name) or "CadastralParcel" (for cadastral parcel).
 * @property {String} matchType - how geocoding is performed : "street number" (exact address), "street enhanced" (street number calculated by interpolation), "street" (only the street), "city" (only the city).
 * @property {Float} accuracy - Accuracy of the response towards the requested location between 0 (unaccurate) and 1 (exact match).
 * @property {Object} placeAttributes - Associative array matching the following attributes with their values given by the underlying web service :
 *
 * *Common attributes : *
 *
 * - **trueGeometry** - the 'real life' geometry if different from 'Point' type.
 *
 * *if type === "StreetAddress" :*
 *
 * - **number** - Street number.
 * - **postalCode** - PostCode
 * - **street** - Street name
 * - **city** - City
 * - **houseNumberInfos** - additional street number information
 * - **inseeCode** - INSEE Code
 *
 *
 * *if type === "PositionOfInterest" :*
 *
 * - **type** - Place name type
 * - **postalCode** - PostCode
 * - **toponyme** - Toponyme
 * - **extraFields** - additional place name properties
 * - **inseeCode** - INSEE Code
 *
 *
 * *si type = "CadastralParcel" :*
 *
 * - **codeCommuneAbs** - when a parcel comes from a city that was absorbed by another, code of that old city. "000" otherwise.
 * - **codeArrondissement** - arrondissement
 * - **identifiant** - cadastral parcel code
 * - **feuille** - Parcel Sheet (eg. "1").
 * - **numero** - Parcel Number (eg. "0041")
 * - **section** - Parcel Section (eg. "0D").
 * - **nomCommune** - Parcel municipality name.
 * - **codeCommune** - Parcel municipality.
 * - **codeDepartement** - Parcel Department.
 *
 * @namespace
 * @alias Gp.Services.Geocode.GeocodedLocation
 */
function GeocodedLocation () {
    if (!(this instanceof GeocodedLocation)) {
        throw new TypeError("GeocodedLocation constructor cannot be called as a function.");
    }

    this.position = null;

    this.matchType = null;

    this.placeAttributes = {};

    this.type = null;

    this.accuracy = null;

    /**
     * Nom de la classe : "GeocodedLocation"
     * @type {String}
     */
    this.CLASSNAME = "GeocodedLocation";
}

GeocodedLocation.prototype = {

    constructor : GeocodedLocation

};

export default GeocodedLocation;
