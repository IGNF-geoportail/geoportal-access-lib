import Gp from "../../../dist/GpServices-src.js";
import Logger from "../../../src/Utils/LoggerByDefault";

import sinon from "sinon";
import { assert } from "chai";
import { expect } from "chai";
import { should } from "chai";
should();

// pass this option from webpack
var mock = __MOCK__;

var logger = Logger.getLogger("test-autoconf");

// xml load...
var autoconfminify, autoconfbeautify, autoconflight;
if (mock) {
    fetch('test/end-to-end/spec-functional/fixtures/autoconf-minify.xml')
    .then(response => response.text())
    .then((data) => {
        logger.warn(data);
        autoconfminify = data;
    });
    fetch('test/end-to-end/spec-functional/fixtures/autoconf-beautify.xml')
    .then(response => response.text())
    .then((data) => {
        logger.warn(data);
        autoconfbeautify= data;
    });
    fetch('test/end-to-end/spec-functional/fixtures/autoconf-beautify-light.xml')
    .then(response => response.text())
    .then((data) => {
        logger.warn(data);
        autoconflight = data;
    });
}

describe("--- Tests fonctionnels du Service d'autoconfiguration --", function () {

    var myKey = (mock) ? "CLE" : "jhyvi0fgmnuxvfv0zjzorvdn";
    var version = Gp.servicesVersion;
    var server;
    before(function () { if (mock) { server = sinon.fakeServer.create(); }});
    after(function () { if (mock) { server.restore(); }});

    describe('Service.getConfig : SUCCESS', function () {

        this.timeout(15000);

        describe("Tests sur les options du protocole du service", function () {

            before(function () {});

            after(function () {});

            // fonction contenant les tests de la reponse JSON
            var functionAssert = function (response) {
                should().exist(response);
                expect(response).to.have.property("generalOptions");
                expect(response).to.have.property("layers");
                expect(response).to.have.property("territories");
                expect(response).to.have.property("tileMatrixSets");
                expect(response).to.have.property("services");
            };

            // options à surcharger
            var options = {
                apiKey: myKey,     // à surcharger
                serverUrl: null,   // à surcharger
                protocol: 'XHR',
                httpMethod: 'GET', // à surcharger : GET|POST

                timeOut: 10000,
                rawResponse: false,
                onSuccess: null, // à surcharger
                onFailure: null  // à surcharger
                // pas d'options spécifique au service
            };

            it("Appel du service avec les options par defaut", function (done) {

                // FIXME pb de timeout !
                // this.timeout(15000);
                // setTimeout(done, 15000);

                // descriptif du test
                // reponse du service en xml pour une requête en production (en fonction de myKey)
                var urlGet = "http://wxs.ign.fr/" + myKey + "/autoconf?gp-access-lib=" + version;
                var okResponseXml = [200, { 'Content-type': 'application/xml' }, autoconfminify];
                if (mock) { server.respondWith('GET', urlGet, okResponseXml); }

                options.httpMethod = "GET";
                options.onSuccess = function (response) {
                    functionAssert(response);
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };

                Gp.Services.getConfig(options);
                if (mock) { server.respond(); }
            });

            it("[MOCK:only] Appel du service en mode 'XHR' avec la méthode 'GET' sur une sortie xml minifiée", function (done) {
                // descriptif du test
                // reponse du service en xml 'minify' (uniquement en mode mock !)
                if (!mock) {
                    console.log("Test uniquement en mode 'mock' !");
                    this.skip();
                }
                var url1Get = "http://wxs.ign.fr/CLE1/autoconf?gp-access-lib=" + version;
                var ok1ResponseXml = [200, { 'Content-type': 'application/xml' }, autoconfminify];
                server.respondWith('GET', url1Get, ok1ResponseXml);

                options.serverUrl  = null;
                options.apiKey     = "CLE1";
                options.httpMethod = "GET";
                options.onSuccess = function (response) {
                    functionAssert(response);
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };

                Gp.Services.getConfig(options);
                server.respond();
            });

            it("[MOCK:only] Appel du service en mode 'XHR' avec la méthode 'GET' sur une sortie xml indentée", function (done) {
                // descriptif du test
                // reponse du service en xml 'beautify' (uniquement en mode mock !)
                if (!mock) {
                    console.log("Test uniquement en mode 'mock' !");
                    this.skip();
                }
                var url2Get = "http://wxs.ign.fr/CLE2/autoconf?gp-access-lib=" + version;
                var ok2ResponseXml = [200, { 'Content-type': 'application/xml' }, autoconfbeautify];
                server.respondWith('GET', url2Get, ok2ResponseXml);

                options.serverUrl  = null;
                options.apiKey     = "CLE2";
                options.httpMethod = "GET";
                options.onSuccess = function (response) {
                    functionAssert(response);
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };

                Gp.Services.getConfig(options);
                server.respond();
            });

            it("Appel du service avec un autoconf local", function (done) {
                // descriptif du test
                // reponse du service en xml pour une requête locale
                var urlLGet = "test/end-to-end/spec-functional/fixtures/autoconf-beautify-light.xml?gp-access-lib=" + version;
                var okResponseLightXml = [200, { 'Content-type': 'application/xml' }, autoconflight];
                if (mock) { server.respondWith('GET', urlLGet, okResponseLightXml); }

                options.serverUrl  = "test/end-to-end/spec-functional/fixtures/autoconf-beautify-light.xml";
                options.apiKey     = null;
                options.httpMethod = "GET";
                options.proxyURL   = null;
                options.onSuccess = function (response) {
                    functionAssert(response);
                    console.log(response);
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };

                Gp.Services.getConfig(options);
                if (mock) { server.respond(); }
            });
        });

        describe("Tests sur les options spécifiques du service", function () {

            // options par defaut (à surcharger)
            var options = {
                apiKey: myKey,
                serverUrl: null,
                protocol: 'XHR',

                httpMethod: 'GET',
                timeOut: 10000,
                rawResponse: false,
                onSuccess: null, // à surcharger !
                onFailure: null, // à surcharger !
                // spécifique au service
                layerId: ''

            };

            // mock sur XHR
            var xhr, requests;

            beforeEach(function () {
                if (mock) {
                    xhr = sinon.useFakeXMLHttpRequest();
                    requests = [];

                    xhr.onCreate = function (request) {
                        requests.push(request);
                    };
                }
            });

            afterEach(function () {
                if (mock) { xhr.restore(); }
            });

            xit("L'option 'layerId' est renseignée", function (done) {
                // descriptif du test
                // FIXME trouver une reponse autoconf 3D
                options.layerId = "LAYER";
                options.onSuccess = function (response) {
                    functionAssert(response);
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };

                Gp.Services.getConfig(options);
                if (mock) {
                    requests[0].respond(200, { "Content-Type": "application/xml" }, autoconfbeautify);
                    expect(requests[0].url).to.be.equal("http://wxs.ign.fr/CLE/autoconf?gp-access-lib=" + version + "layerId=LAYER");
                }
            });
        });
    });
});
