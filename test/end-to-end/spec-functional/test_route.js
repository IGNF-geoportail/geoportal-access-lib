/**
* Attention, le service est en mode bouchon,
* et le service en production n'est pas pleinemennt opérationnel (recette)
*/
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
var routeResponseJson, routeResponseJsonToll;

if (mock) {

    fetch('test/end-to-end/spec-functional/fixtures/route-response.json')
    .then(response => response.text())
    .then((data) => {
        logger.warn(data);
        routeResponseJson = data;
    });
    fetch('test/end-to-end/spec-functional/fixtures/route-response-toll.json')
    .then(response => response.text())
    .then((data) => {
        logger.warn(data);
        routeResponseJsonToll = data;
    });

}

describe("-- Tests fonctionnels du Service de Calcul d’itinéraires --", function () {

    var myKey = (mock) ? "CLE" : "jhyvi0fgmnuxvfv0zjzorvdn";
    var version = Gp.servicesVersion;

    describe('Service.route : SUCCESS', function () {

        this.timeout(15000);

        describe("Test sur les options du Protocole", function () {

            var server;
            var options;

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

            beforeEach(function () {
                if (mock) { server = sinon.fakeServer.create(); }
                options = {
                    apiKey: myKey,
                    serverUrl: 'http://localhost:8080/simple/1.0.0/route',
                    protocol: 'XHR', // à surcharger : JSONP|XHR

                    httpMethod: 'GET', // à surcharger : GET|POST
                    timeOut: 10000,
                    rawResponse: false,
                    onSuccess: function (response) {
                        console.log(response);
                    },
                    onFailure: function (error) {
                        console.log(error);
                    },
                    // spécifique au service
                    api: 'REST', 
                    outputFormat: 'json', 
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
                    exclusions: ["toll", "tunnel"],
                    distanceUnit: "km",
                    graph: "Voiture",
                    provideGeometry: false,
                    routePreference: "fastest",
                    srs: "EPSG:4326"
                };

                // OK reponse du service REST
                var urlGet = "http://wxs.ign.fr/" + myKey + "/itineraire/rest/route.json?gp-access-lib=" + version + "&origin=2.64,48.54&destination=3.01,48.45&method=TIME&waypoints=&graphName=Voiture&exclusions=toll;tunnel&srs=EPSG:4326&format=STANDARD";
                var okResponseJson = [200, { 'Content-type': 'application/json' }, routeResponseJson];
                if (mock) { server.respondWith('GET', urlGet, okResponseJson); }

            });

            afterEach(function () {
                if (mock) { server.restore(); }
            });

            it("Appel du service en mode 'XHR'" +
            " avec la méthode 'GET'" +
            " avec l'API 'REST'" +
            " pour un format de sortie en 'json'", function (done) {

                options.onSuccess = function (response) {
                    functionAssert(response);
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };

                Gp.Services.route(options);
                if (mock) { server.respond(); }
            });

            xit("Appel du service en mode 'XHR'" +
            " avec la méthode 'POST'" +
            " avec l'API 'REST'" +
            " pour un format de sortie en 'json'", function (done) {
                // TODO

                // le service ne prend pas en compte le POST
                options.httpMethod = 'POST';
                options.onSuccess = function (response) {
                    functionAssert(response);
                    done();
                };
                options.onFailure = function (error) {
                    console.log(error);
                    done(error);
                };

                Gp.Services.route(options);
                if (mock) { server.respond(); }
            });

        });

        describe("Test sur les options spécifiques du service (mode 'XHR' avec la méthode 'GET', api 'REST' et format 'json')", function () {

            // fonction contenant les tests de la reponse
            var functionResponseAssert = function (response) {
                should().exist(response);
                expect(response).to.be.an("Object");
                expect(response).to.have.property("bbox");
                expect(response.bbox).to.be.an("Object");
                expect(response.bbox).to.have.property("left");
                expect(response.bbox).to.have.property("right");
                expect(response.bbox).to.have.property("top");
                expect(response.bbox).to.have.property("bottom");
                expect(response).to.have.property("routeGeometry");
                expect(response.routeGeometry).to.be.an("Object");
                expect(response.routeGeometry).to.have.property("coordinates");
                expect(response.routeGeometry.coordinates).to.be.an("Array");
                expect(response.routeGeometry).to.have.property("type");
                expect(response).to.have.property("totalDistance");
                expect(response).to.have.property("totalTime");
                expect(response).to.have.property("routeInstructions");
                expect(response.routeInstructions).to.be.an("Array");
                expect(response.routeInstructions[0]).to.have.property("code");
                expect(response.routeInstructions[0]).to.have.property("distance");
                expect(response.routeInstructions[0]).to.have.property("duration");
                expect(response.routeInstructions[0]).to.have.property("instruction");
            };

            // mock sur XHR
            var xhr, requests;
            var options;

            before(function () {
                if (mock) {
                    xhr = sinon.useFakeXMLHttpRequest();
                    requests = [];

                    xhr.onCreate = function (request) {
                        requests.push(request);
                    };
                }
                // options par défaut (à surcharger)
                options = {
                    apiKey: myKey,
                    serverUrl: 'http://localhost:8080/simple/1.0.0/route',
                    protocol: 'XHR',

                    httpMethod: 'GET',
                    timeOut: 10000,
                    rawResponse: false,
                    onSuccess: function (response) {
                        console.log(response);
                    },
                    onFailure: function (error) {
                        console.log(error);
                    },
                    // spécifique au service
                    // api: 'REST',
                    // outputFormat: 'json',
                    startPoint: {
                        x: 2.114694,
                        y: 48.897552
                    },
                    endPoint: {
                        x: 2.130327,
                        y: 48.902576
                    },
                    // viaPoints: [],
                    // provideBbox: true,
                    // exclusions: ["tunnel", "toll"], // "Bridge"
                    // distanceUnit: "km",
                    // graph: "Voiture",
                    // provideGeometry: false,
                    // routePreference: "fastest",
                    // srs: "EPSG:4326"
                };
            });

            after(function () {
                if (mock) { xhr.restore(); }
            });

            describe("les options 'startPoint|endPoint' sont renseignées", function() {

                it("les options 'startPoint|endPoint' sont renseignées", function (done) {
                    // description du test : envoi d'une requête GET avec les params origin, destination, calcul d'itineraire, pas d'exclusions et graph voiture (options par défaut)

                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };

                    Gp.Services.route(options);

                    if (mock) {
                        requests[0].respond(200, { "Content-Type": "application/json" }, routeResponseJson);
                    }
                });
            });

            describe("Les options 'startPoint|endPoint' et 'exclusions' sont renseignées", function() {

                it("exclusions = bridge", function(done) {
                    // description du test : envoi d'une requête GET avec les params origin, destination, exclusions=bridge calcul d'itineraire, et graph voiture (options par défaut)

                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.exclusions = ["bridge"];

                    Gp.Services.route(options);

                    if (mock) {
                        requests[1].respond(200, { "Content-Type": "application/json" }, routeResponseJson);
                    }
                });

                it("exclusions = toll", function(done) {
                    // description du test :envoi d'une requête GET avec les params origin, destination, exclusions=toll calcul d'itineraire, et graph voiture (options par défaut)

                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.exclusions = ["toll"];

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

                it("exclusions = tunnel", function(done) {
                    // description du test :envoi d'une requête GET avec les params origin, destination, exclusions=tunnel calcul d'itineraire, et graph voiture (options par défaut)

                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.exclusions = ["tunnel"];

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

                it("exclusions = bridge, toll, tunnel", function(done) {
                    // description du test :envoi d'une requête GET avec les params origin, destination, exclusions="bridge","toll","tunnel" calcul d'itineraire, et graph voiture (options par défaut)

                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.exclusions = ["bridge","toll","tunnel"];

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

            });

            describe("Les options 'startPoint|endPoint' et 'graph' sont renseignées", function() {

                it("graph = Voiture", function(done) {
                    // description du test :envoi d'une requête GET avec les params origin, destination, graph = Voiture calcul d'itineraire, et graph voiture (options par défaut)

                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.exclusions = [];
                    options.graph = "Voiture";

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

                it("graph = Pieton", function(done) {
                    // description du test :envoi d'une requête GET avec les params origin, destination, graph = Pieton calcul d'itineraire, et graph pieton (options par défaut)

                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.graph = "Pieton";

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

                it("graph = car", function(done) {
                    // description du test :envoi d'une requête GET avec les params origin, destination, graph = car calcul d'itineraire, et graph voiture (options par défaut)

                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.graph = "car";

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

                it("graph = pedestrian", function(done) {
                    // description du test :envoi d'une requête GET avec les params origin, destination, graph = pedestrian calcul d'itineraire, et graph pieton (options par défaut)

                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.graph = "pedestrian";

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

            });

            describe("Les options 'startPoint|endPoint' et 'routePreference' sont renseignées", function() {

                it("routePreference = fastest", function(done) {
                    // description du test :envoi d'une requête GET avec les params origin, destination, routePreference = fastest calcul d'itineraire, et graph voiture (options par défaut)

                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.graph = "car";
                    options.routePreference = "fastest";

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

                it("routePreference = shortest", function(done) {
                    // description du test :envoi d'une requête GET avec les params origin, destination, routePreference = shortest calcul d'itineraire, et graph voiture (options par défaut)

                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.routePreference = "shortest";

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

            });


            describe("Les options 'startPoint|endPoint' avec 'viaPoints' sont renseignées", function () {

                it("ajout d'une étape", function(done) {
                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.routePreference = "fastest";
                    options.viaPoints = [
                        {
                            x: 2.114780,
                            y: 48.897421
                        }
                    ];

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

                it("ajout de plusieurs points", function(done) {
                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.viaPoints = [
                        {
                            x: 2.114780,
                            y: 48.897421
                        },
                        {
                            x: 2.114580,
                            y: 48.897721
                        }
                    ];

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

            });

            describe("Utilisation des options : provideBbox, provideGeometry, distanceUnit", function () {

                it("provideBbox = true", function(done) {
                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.viaPoints = [];
                    options.provideBbox = true;

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

                it("provideGeometry = true", function(done) {
                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.provideGeometry = true;

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

                it("distanceUnit = km", function(done) {
                    options.onSuccess = function (response) {
                        console.log(response);
                        functionResponseAssert(response);
                        done();
                    };
                    options.onFailure = function (error) {
                        console.log(error);
                        done(error);
                    };
                    options.distanceUnit = "km";

                    Gp.Services.route(options);

                    if (mock) {
                        requests[2].respond(200, { "Content-Type": "application/json" }, routeResponseJsonToll);
                    }
                });

            });
        });
    });
});
