import CommonService from "../CommonService";
import AutoCompleteResponseFactory from "./Response/AutoCompleteResponseFactory";
import Logger from "../../Utils/LoggerByDefault";
import MR from "../../Utils/MessagesResources";
import Helper from "../../Utils/Helper";
import ErrorService from "../../Exceptions/ErrorService";

/**
 * @classdesc
 * Appel du service d'autocomplétion du Géoportail :
 * envoi de la requête construite selon les paramètres en options,
 * éventuellement parsing et analyse  de la réponse,
 * retour d'une réponse en paramètre de la fonction onSuccess.
 * @constructor
 * @extends {Gp.Services.CommonService}
 * @alias Gp.Services.AutoComplete
 *
 * @param {Object} options - options spécifiques au service (+ les options heritées)
 *
 * @param {String} options.text - La chaîne de caractère à compléter.
 *      Cette chaîne n'est pas "URL encodée".
 *      C'est l'API qui s'occupe de l'encoder pour l'inclure dans la requête.
 *
 * @param {Array.<String>} [options.type = ["StreetAddress"]] - Type de l'objet recherché.
 *      Le service d'autocomplétion du Géoportail permet de rechercher des toponymes 'PositionOfInterest' et/ou des adresses postales 'StreetAddress'.
 *      D'autres types pourront être rajoutés selon l'évolution du service.
 *      Par défaut, type = ['StreetAddress'].
 *
 * @param {String} [options.territory] - Limitation de la zone de recherche de localisants.
 *      Le service d'autocomplétion du Géoportail permet de limiter la recherche à la métropole et la Corse : options.territory = 'METROPOLE',
 *      DOMS TOMS : options.territory = 'DOMTOM', ou à un département : options.territory = '31'
 *      Pas de valeur par défaut.
 *      La valeur par défaut est donc celle du service.
 *      Le service d'autocomplétion du Géoportail renvoie toutes les informations quand aucun territoire n'est spécifié.
 *
 * @param {Number} [options.maximumResponses = 10] - Nombre de réponses maximal que l'on souhaite recevoir.
 *      Pas de valeur par défaut.
 *      La valeur par défaut sera donc celle du service : 10.
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
 *      text : "",
 *      type : "StreetAddress",
 *      territory : 'METROPOLE',
 *      maximumResponses : 10
 *   };
 * @private
 */
function AutoComplete (options_) {
    if (!(this instanceof AutoComplete)) {
        throw new TypeError(MR.getMessage("CLASS_CONSTRUCTOR", "AutoComplete"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "AutoComplete";

    this.logger = Logger.getLogger("Gp.Services.AutoComplete");
    this.logger.trace("[Constructeur AutoComplete (options)]");

    var options = this.patchOptionConvertor(options_);
    options.serverUrl = options.serverUrl || "https://geocodage.ign.fr/look4/completion";

    // appel du constructeur par heritage
    CommonService.apply(this, arguments);

    if (!options.text) {
        throw new Error(MR.getMessage("PARAM_MISSING", "text"));
    }

    // ajout des options spécifiques au service
    this.options.text = options.text;

    // on definit des parametres par defaut
    if (!options.type) {
        options.type = ["StreetAddress"];
    }

    this.options.type = options.type;
    this.options.territory = options.territory || "";
    this.options.maximumResponses = options.maximumResponses || 10;

    // INFO
    // le service ne repond pas en mode POST (405 Method Not Allowed)
    if (this.options.protocol === "XHR" && this.options.httpMethod === "POST") {
        this.logger.warn("Le service ne gére pas le mode d'interrogation en POST, on bascule sur du GET !");
        this.options.httpMethod = "GET"; // on surcharge !
    }

    // attributs d'instances

    /**
     * Format forcé de la réponse du service : "json"
     * sauf si l'on souhaite une reponse brute (options.rawResponse)
     */
    this.options.outputFormat = (this.options.rawResponse) ? "" : "json";
}

/**
 * @lends module:AutoComplete#
 */

AutoComplete.prototype = Object.create(CommonService.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
AutoComplete.prototype.constructor = AutoComplete;

/**
 * Patch pour la convertion des options vers le nouveau formalisme.
 *
 * @param {Object} options_ - options du service
 * @return {Object} - options
 */
AutoComplete.prototype.patchOptionConvertor = function (options_) {
    const options = options_;

    if (options.filterOptions) {
        this.logger.warn("The parameter 'filterOptions' is deprecated");

        if (options.filterOptions.type) {
            this.logger.warn("The parameter 'filterOptions.type' is deprecated");
            if (!options.type) {
                options.type = options.filterOptions.type;
            }
        }

        if (options.filterOptions.territory) {
            this.logger.warn("The parameter 'filterOptions.territory' is deprecated");
            if (!options.terr) {
                options.terr = options.filterOptions.territory;
            }
        }

        delete options.filterOptions;
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
AutoComplete.prototype.buildRequest = function (error, success) {
    // ex.
    // http://wxs.ign.fr/CLEF/ols/apis/completion?
    // text=Brie-Comt&
    // type=StreetAddress,PositionOfInterest&
    // territory=METROPOLE&
    // maximumResponses=10

    // traitement des param KPV sous forme de tableau
    var territory = "";
    if (this.options.territory) {
        territory = this.options.territory;
    }

    var type = "";
    if (this.options.type) {
        type = this.options.type.join(",");
    }

    // normalisation de la requete avec param KPV
    this.request = Helper.normalyzeParameters({
        text : encodeURIComponent(this.options.text),
        type : type,
        terr : territory,
        maximumResponses : this.options.maximumResponses
    });

    (!this.request)
        ? error.call(this, new ErrorService(MR.getMessage("SERVICE_REQUEST_BUILD")))
        : success.call(this, this.request);
};

/**
 * (overwrite)
 * Analyse de la reponse
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback de succès de l'analyse de la réponse
 */
AutoComplete.prototype.analyzeResponse = function (error, success) {
    if (this.response) {
        var options = {
            response : this.response,
            rawResponse : this.options.rawResponse,
            onSuccess : success,
            onError : error,
            scope : this
        };

        AutoCompleteResponseFactory.build(options);
    } else {
        error.call(this, new ErrorService(MR.getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

export default AutoComplete;
