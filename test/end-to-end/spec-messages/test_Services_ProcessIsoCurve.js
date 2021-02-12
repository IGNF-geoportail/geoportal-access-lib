import Gp from "../../../dist/GpServices-src.js";

import { expect } from "chai";
import { should } from "chai";
should();

// pass this option from webpack
var mock = __MOCK__;

describe("-- Test sur les messages d'erreur spécifiques du Service de calcul d'iso --", function() {

    var Services = null;
    var options = {};

    beforeEach(function() {

        // options par defaut du geocodage direct
        options = {
            apiKey : 'jhyvi0fgmnuxvfv0zjzorvdn',
            serverUrl : "https://itineraire.ign.fr/simple/1.0.0/isochrone",
            protocol : 'JSONP',
            // proxyURL : (window.proxy) ? 'spec-messages/proxy/php/proxy.php?url=' : null, // ex. 'spec-messages/proxy/php/proxy.php?url='
            httpMethod : 'GET',
            timeOut : 0,
            rawResponse : false,
            onSuccess : function (response) { console.log('onSuccess() :', response); },
            onFailure : function (error) {console.log("onFailure() : ", error.message, error.type, error.status);},
            // spécifique au service
            position : {
                x: 2.3242664298058053,
                y: 48.86118017324745
            },
            outputFormat : 'json',
            exclusions : ['Bridge', 'Tunnel'],
            graph : "Voiture",
            method : 'distance',
            distance : 200, //time : 200
            reverse : false,
            smoothing : false,
            holes : false,
            srs : 'EPSG:4326'
        };

    });

    xit("Erreur de clef API : clef inconnue du service", function (done) {
        // Exception de type ErrorService
        // Levée par le protocole (XHR)
        // Renvoyer pour le callback onFailure()
        // Message : Errors Occured on Http Request (status : 'Forbidden (...)
        // Type : SERVICE_ERROR
        // Status : 403

        // FIXME uniquement en XHR ! Il n'est pas possible de lever les erreurs en JSONP
        // sauf un TimeOut...
        options.apiKey = "bidon";
        options.protocol = 'XHR';
        options.onFailure = function (e) {
            console.log(e.message);
            expect(e).not.to.be.null;
            expect(e.message).to.contain("Key does not exist or has expired"); // Key does not exist or has expired
            expect(e.type).to.be.equal("SERVICE_ERROR");
            expect(e.status).to.be.equal(403);
            done();
        };
        options.onSuccess = function (response) {
            expect(false).to.be.true;
            done(response);
        }

        Gp.Services.isoCurve(options);
    });

    it("Erreur de position : option non renseignée", function () {
        // Exception de type Error
        // Levée par le constructeur ProcessIsoCurve(), on ne souhaite pas passer par le callback onFailure()
        // Capturée UNIQUEMENT via un try/catch
        // Message : Parameter(s) 'position' missing
        // (Type : ERROR_USAGE)
        // (Status : -1)
        options.position = null;
        try {
            Gp.Services.isoCurve(options);
            expect(false).to.be.true;
        } catch (e) {
            console.log(e.message);
            expect(e).not.to.be.null;
            expect(e.message).to.be.equal("Parameter(s) 'position' missing");
        } finally {}
    });

    it("Erreur de position : coordonnée X indefinie", function () {
        // Exception de type Error
        // Levée par le constructeur ProcessIsoCurve(), on ne souhaite pas passer par le callback onFailure()
        // Capturée UNIQUEMENT via un try/catch
        // Message : Parameter(s) 'position.x' missing
        // (Type : ERROR_USAGE)
        // (Status : -1)
        options.position = {
            x: null,
            y: null
        };
        try {
            Gp.Services.isoCurve(options);
            expect(false).to.be.true;
        } catch (e) {
            console.log(e.message);
            expect(e).not.to.be.null;
            expect(e.message).to.be.equal("Parameter(s) 'position.x' missing");
        } finally {}
    });

    it("Erreur de position : coordonnée Y indefinie", function () {
        // Exception de type Error
        // Levée par le constructeur ProcessIsoCurve(), on ne souhaite pas passer par le callback onFailure()
        // Capturée UNIQUEMENT via un try/catch
        // Message : Parameter(s) 'position.y' missing
        // (Type : ERROR_USAGE)
        // (Status : -1)
        options.position = {
            x: 2.225558,
            y: null
        };
        try {
            Gp.Services.isoCurve(options);
            expect(false).to.be.true;
        } catch (e) {
            console.log(e.message);
            expect(e).not.to.be.null;
            expect(e.message).to.be.equal("Parameter(s) 'position.y' missing");
        } finally {}
    });

    it("Erreur du format de sortie : valeur inconnue", function () {
        // Exception de type Error
        // Levée par le constructeur ProcessIsoCurve(), on ne souhaite pas passer par le callback onFailure()
        // Capturée UNIQUEMENT via un try/catch
        // Message : Url by default not found !
        // (Type : ERROR_USAGE)
        // (Status : -1)

        options.outputFormat = 'BIDON';
        try {
            Gp.Services.isoCurve(options);
            expect(false).to.be.true;
        } catch (e) {
            console.log(e.message);
            expect(e).not.to.be.null;
            expect(e.message).to.be.equal("Value(s) for parameter(s) 'outputFormat' not supported");
        } finally {}
    });

    xit("Erreur sur les exclusions : valeur inconnue", function (done) {
        // Exception de type ErrorService
        // Levée par XHR()
        // Renvoyer pour le callback onFailure()
        // Message : (...) ServiceException (...)
        // Type : SERVICE_ERROR
        // Status : 500
        //  ex. de message du service :
        //  {"message":"ServiceException: Error in route computation\nError in smartrouting\nFailed to execute calculateRoute\nunknown reject flag 'BIDON'","status":"ERROR"}

        // FIXME
        // test avec le protocole XHR car le service implemente très mal le callback avec le JSONP!
        options.protocol = 'XHR';
        options.exclusions = ['BIDON'];
        options.onFailure = function (e) {
            console.log(e);
            expect(e).not.to.be.null;
            expect(e.message).to.contain("ServiceException");
            expect(e.type).to.be.equal("SERVICE_ERROR");
            expect(e.status).to.be.equal(500);
            done();
        };
        options.onSuccess = function (response) {
            done(response);
        };

        Gp.Services.isoCurve(options);
    });

    xit("Erreur sur le graphe : valeur inconnue", function (done) {
        // Exception de type ErrorService
        // Levée par XHR()
        // Renvoyer pour le callback onFailure()
        // Message : (...) ServiceException (...)
        // Type : SERVICE_ERROR
        // Status : 500 Internal Server Error
        //  ex. de message du service :
        //  {"message":"ServiceException: Error in route computation\nError in smartrouting\nFailed to execute calculateRoute\nunknown reject flag 'BIDON'","status":"ERROR"}

        // FIXME
        // test avec le protocole XHR car le service implemente très mal le callback avec le JSONP!
        options.protocol = 'XHR';
        options.graph = 'BIDON';
        options.onFailure = function (e) {
            console.log(e);
            expect(e).not.to.be.null;
            expect(e.message).to.contain("ServiceException");
            expect(e.type).to.be.equal("SERVICE_ERROR");
            expect(e.status).to.be.equal(500);
            done();
        };
        options.onSuccess = function (response) {
            done(response);
        };

        Gp.Services.isoCurve(options);
    });
});
