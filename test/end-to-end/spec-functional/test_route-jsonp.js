/**
* Attention, le service est en mode bouchon,
* et le service en production n'est pas pleinemennt opérationnel (recette)
*
* FIXME avec le JSONP, l'erreur est au niveau du html (execution de la balise script),
* et il est difficile de la levée..., afin de la faire apparaitre dans les tests...
*/
import Gp from "../../../dist/GpServices-src.js";

import sinon from "sinon";
import { assert } from "chai";
import { expect } from "chai";
import { should } from "chai";
should();

// pass this option from webpack
var mock = __MOCK__;

describe("-- Tests fonctionnels du Service de Calcul d’itinéraires : JSONP --", function () {

    var myKey = (mock) ? "CLE" : "jhyvi0fgmnuxvfv0zjzorvdn";

    describe('Service.route : SUCCESS', function () {

        this.timeout(15000);

        describe("Test sur l'utilisation basique du service (paramètres par défaut) ", function () {

            // options par defaut (à surcharger)
            var options = {
                apiKey: myKey,
                protocol: 'JSONP',
                callbackSuffix: "",
                onSuccess: null,
                onFailure: null,
                // spécifique au service
                startPoint: {
                    x: 2.64,
                    y: 48.54
                },
                endPoint: {
                    x: 3.01,
                    y: 48.45
                }
            };

            it("paramètres apiKey, startPoint, endPoint, et les callbacks onSuccess et onFailure", function (done) {
                // description du test
                // requête GET du service REST en json
                if (mock) { options.serverUrl = 'test/end-to-end/spec-functional/fixtures/jsonp/callback-route-json-default'; }
                options.onSuccess = function (response) {
                    console.log("onsuccess : ",response);

                    should().exist(response);
                    expect(response).to.be.an("Object");
                    expect(response).to.have.property("bbox");
                    expect(response.bbox).to.be.an("Object");
                    expect(response.bbox).to.have.property("left");
                    expect(response.bbox).to.have.property("right");
                    expect(response.bbox).to.have.property("top");
                    expect(response.bbox).to.have.property("bottom");

                    expect(response).to.have.property("routeGeometry");
                    expect(response.routeGeometry).to.have.property("type", "LineString");
                    expect(response.routeGeometry).to.have.property("coordinates");
                    expect(response.routeGeometry.coordinates).to.be.an("array");
                    // expect(response.routeGeometry.coordinates).to.have.length(894);
                    expect(response.routeGeometry.coordinates[0]).to.be.an("array");

                    expect(response).to.have.property("totalDistance", "38.54 Km");
                    // expect(response).to.have.property("totalTime", 2118.99);

                    expect(response).to.have.property("routeInstructions");
                    expect(response.routeInstructions).to.be.an("Array");
                    expect(response.routeInstructions[0]).to.have.property("code");
                    expect(response.routeInstructions[0]).to.have.property("distance");
                    expect(response.routeInstructions[0]).to.have.property("duration");
                    expect(response.routeInstructions[0]).to.have.property("instruction");
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };
                options.onTimeOut = function () {
                    var error = "Reception d'un Time out (json) !";
                    console.log(error);
                    done(error);
                };
                Gp.Services.route(options);
            })
        });

        describe("Test sur les options du Protocole", function (done) {

            // fonction contenant les tests de la reponse
            var functionAssert = function (response) {
                console.log(response);
                should().exist(response);
                expect(response).to.be.an("Object");
                expect(response).to.have.property("bbox");
                expect(response.bbox).to.be.an("Object");
                expect(response.bbox).to.have.property("left");
                expect(response.bbox).to.have.property("right");
                expect(response.bbox).to.have.property("top");
                expect(response.bbox).to.have.property("bottom");
                expect(response).to.have.property("routeGeometry");
                expect(response).to.have.property("totalDistance");
                expect(response).to.have.property("totalTime");
                expect(response).to.have.property("routeInstructions");
                expect(response.routeInstructions).to.be.an("Array");
                expect(response.routeInstructions[0]).to.have.property("code");
                expect(response.routeInstructions[0]).to.have.property("distance");
                expect(response.routeInstructions[0]).to.have.property("duration");
                expect(response.routeInstructions[0]).to.have.property("instruction");
            };

            var options;

            beforeEach(function () {
                // options par defaut (à surcharger)
                options = {
                    apiKey: myKey,
                    // serverUrl: null,
                    protocol: 'JSONP', // à surcharger : JSONP|XHR
                    callbackSuffix: "",

                    httpMethod: 'GET', // à surcharger : GET|POST
                    timeOut: 10000000000,
                    rawResponse: false,
                    onSuccess: null, // à surcharge
                    onFailure: null, // à surcharge
                    // spécifique au service
                    api: 'REST', // à surcharger : REST|OLS
                    outputFormat: 'json', // à surcharger : json|xml
                    startPoint: {
                        x: 2.64,
                        y: 48.54
                    },
                    endPoint: {
                        x: 3.01,
                        y: 48.45
                    },
                    viaPoints: [],
                    provideBbox: true,
                    exclusions: ["tunnel", "toll"],
                    distanceUnit: "km",
                    graph: "Voiture",
                    provideGeometry: false,
                    routePreference: "fastest",
                    srs: "EPSG:4326"
                };
            });

            it("Appel du service en mode 'JSONP'" +
            " avec l'API 'REST'" +
            " pour un format de sortie en 'json'", function (done) {
                // description du test
                // requête GET du service en json
                // la reponse du service de production en JSONP est un json avec un callback
                //   var urlJsonPGet = "http://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn/itineraire/rest/route.json?output=json&origin=2.64,48.54&destination=3.01,48.45&method=TIME&graphName=Voiture&exclusions=Toll;Tunnel&srs=EPSG:4326&callback=callback";
                //   var okResponseJSONPjson =[200, { 'Content-type': 'application/javascript' }, 'callback({})'];

                if (mock) { options.serverUrl = 'test/end-to-end/spec-functional/fixtures/jsonp/callback-route-json'; }
                options.outputFormat = 'json';
                options.onSuccess = function (response) {
                    //debugger;
                    functionAssert(response);
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };
                options.onTimeOut = function () {
                    var error = "Reception d'un Time out (route) !";
                    console.log(error);
                    done(error);
                };

                Gp.Services.route(options);
            });

            xit("Appel du service en mode 'JSONP'" +
            " avec l'API 'REST'" +
            " pour un format de sortie en 'xml'", function (done) {
                // description du test
                // requête GET du service en xml
                // la reponse du service de production en JSONP est un xml encapsulé dans un JSON avec un callback
                //   var urlJsonPGet = "http://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn//itineraire/rest/route.xml?output=json&origin=2.64,48.54&destination=3.01,48.45&method=TIME&graphName=Voiture&exclusions=Toll;Tunnel&srs=EPSG:4326&callback=callback";
                //   var okResponseJSONPjson =[200, { 'Content-type': 'application/javascript' }, 'callback({{"http":{"status":200,"error":null},"xml":""}})'];

                if (mock) { options.serverUrl = 'test/end-to-end/spec-functional/fixtures/jsonp/callback-route-xml'; }
                options.outputFormat = 'xml';
                options.onSuccess = function (response) {
                    functionAssert(response);
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };
                options.onTimeOut = function () {
                    var error = "Reception d'un Time out (route) !";
                    console.log(error);
                    done(error);
                };

                Gp.Services.route(options);
            });

            xit("Appel du service en mode 'JSONP'" +
            " avec l'API 'OLS'" +
            " pour un format de sortie en 'json'", function (done) {
                // description du test
                // requête GET du service en json
                // la reponse du service de production en JSONP est un json avec un callback
                //   var urlJsonPGet = "http://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn/itineraire/ols?output=xml&qml=%33%&callback=callback";
                //   var okResponseJSONPjson =[200, { 'Content-type': 'application/javascript' }, 'callback({})'];

                if (mock) { options.serverUrl = 'test/end-to-end/spec-functional/fixtures/jsonp/callback-route-json'; }
                options.outputFormat = 'json';
                options.api = "OLS";
                options.onSuccess = function (response) {
                    functionAssert(response);
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };
                options.onTimeOut = function () {
                    var error = "Reception d'un Time out (route) !";
                    console.log(error);
                    done(error);
                };

                Gp.Services.route(options);
            });

            xit("Appel du service en mode 'JSONP'" +
            " avec l'API 'OLS'" +
            " pour un format de sortie en 'xml'", function (done) {
                // description du test
                // requête GET du service en xml
                // la reponse du service de production en JSONP est un xml encapsulé dans un JSON avec un callback
                //   var urlJsonPGet = "http://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn//itineraire/ols?output=xml&qml=%33%&callback=callback";
                //   var okResponseJSONPjson =[200, { 'Content-type': 'application/javascript' }, 'callback({{"http":{"status":200,"error":null},"xml":""}})'];

                if (mock) { options.serverUrl = 'test/end-to-end/spec-functional/fixtures/jsonp/callback-route-xml'; }
                options.outputFormat = 'xml';
                options.api = "OLS";
                options.onSuccess = function (response) {
                    functionAssert(response);
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };
                options.onTimeOut = function () {
                    var error = "Reception d'un Time out (route) !";
                    console.log(error);
                    done(error);
                };

                Gp.Services.route(options);
            });
        });
    });
});
