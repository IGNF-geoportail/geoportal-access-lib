/**
 * Attention, le service est en mode bouchon,
 * et le service en production n'est pas pleinemennt opérationnel (recette)
 */

define([
    'gp',
    'chai', 'sinon',
    'text!../../test/spec-functional/fixtures/route-response.xml',
    'text!../../test/spec-functional/fixtures/route-response.json',
    'text!../../test/spec-functional/fixtures/route-response-toll.json',
    'text!../../test/spec-functional/fixtures/route-request.xml'
], function (Gp, chai, sinon, routeResponseXml, routeResponseJson, routeResponseJsonToll, routeResquestXml) {

    var assert = chai.assert;
    var expect = chai.expect;
    var should = chai.should();

    describe("-- Tests fonctionnels du Service de Calcul d’itinéraires : OK --", function () {

        var myKey = (mock) ? "CLE" : "jhyvi0fgmnuxvfv0zjzorvdn";
        var version = Gp.servicesVersion;

        describe('Service.route : SUCCESS', function () {

            describe("Test sur les options du Protocole", function () {

                var server;
                var options;

                // fonction contenant les tests de la reponse
                var functionAssert = function (response) {
                    console.log(response);
                    should.exist(response);
                    expect(response).to.be.an("Object");
                    expect(response).to.have.property("bbox");
                    expect(response.bbox).to.be.an("Object");
                    expect(response).to.have.deep.property("bbox.left");
                    expect(response).to.have.deep.property("bbox.right");
                    expect(response).to.have.deep.property("bbox.top");
                    expect(response).to.have.deep.property("bbox.bottom");
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
                        serverUrl: null,
                        protocol: 'XHR', // à surcharger : JSONP|XHR
                        proxyURL: (mock) ? null : "http://localhost/proxy/php/proxy.php?url=",
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
                        exclusions: ["Toll", "Tunnel"],
                        distanceUnit: "km",
                        graph: "Voiture",
                        provideGeometry: false,
                        routePreference: "fastest",
                        srs: "EPSG:4326"
                    };

                    // OK reponse du service REST
                    var urlGet = "http://wxs.ign.fr/" + myKey + "/itineraire/rest/route.json?gp-access-lib=" + version + "&origin=2.64,48.54&destination=3.01,48.45&method=TIME&waypoints=&graphName=Voiture&exclusions=Toll;Tunnel&srs=EPSG:4326&format=STANDARD";
                    var urlXGet = "http://wxs.ign.fr/" + myKey + "/itineraire/rest/route.xml?gp-access-lib=" + version + "&origin=2.64,48.54&destination=3.01,48.45&method=TIME&waypoints=&graphName=Voiture&exclusions=Toll;Tunnel&srs=EPSG:4326&format=STANDARD";
                    var okResponseXml = [200, { 'Content-type': 'application/xml' }, routeResponseXml];
                    var okResponseJson = [200, { 'Content-type': 'application/json' }, routeResponseJson];
                    if (mock) { server.respondWith('GET', urlGet, okResponseJson); }
                    if (mock) { server.respondWith('GET', urlXGet, okResponseXml); }

                    // OK reponse du service en xml OLS
                    var urlXGetOls = "http://wxs.ign.fr/" + myKey + "/itineraire/ols?gp-access-lib=" + version;
                    var urlXPostOls = "http://wxs.ign.fr/" + myKey + "/itineraire/ols?gp-access-lib=" + version;
                    if (mock) { server.respondWith('GET', urlXGetOls, okResponseXml); }
                    if (mock) { server.respondWith('POST', urlXPostOls, okResponseXml); }
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

                it("Appel du service en mode 'XHR'" +
                    " avec la méthode 'POST'" +
                    " avec l'API 'REST'" +
                    " pour un format de sortie en 'json'", function (done) {
                    // description du test : on a désactivé le POST en XHR+REST,
                    // on interroge donc le service en GET (comme le test ci-dessus)

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

                it("Appel du service en mode 'XHR'" +
                    " avec la méthode 'GET'" +
                    " avec l'API 'REST'" +
                    " pour un format de sortie en 'xml'", function (done) {

                    options.httpMethod = 'GET';
                    options.outputFormat = 'xml';
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

                it("Appel du service en mode 'XHR'" +
                    " avec la méthode 'POST'" +
                    " avec l'API 'REST'" +
                    " pour un format de sortie en 'xml'", function (done) {
                    // description du test : on a désactivé le POST en XHR+REST,
                    // on interroge donc le service en GET (comme le test ci-dessus)

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

                it("Appel du service en mode 'XHR'" +
                    " avec la méthode 'GET'" +
                    " avec l'API 'OLS'" +
                    " pour un format de sortie en 'xml'", function (done) {
                    // description du test : on a désactivé l'api OLS pour l'instant (reader XML non implémenté), on passe toujours par l'api REST.

                    options.httpMethod = 'GET';
                    options.api = 'OLS';
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

                it("Appel du service en mode 'XHR'" +
                    " avec la méthode 'POST'" +
                    " avec l'API 'OLS'" +
                    " pour un format de sortie en 'xml'", function (done) {
                    // description du test : on a désactivé l'api OLS pour l'instant (reader XML non implémenté), on passe toujours par l'api REST.

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
                    should.exist(response);
                    expect(response).to.be.an("Object");
                    expect(response).to.have.property("bbox");
                    expect(response.bbox).to.be.an("Object");
                    expect(response).to.have.deep.property("bbox.left");
                    expect(response).to.have.deep.property("bbox.right");
                    expect(response).to.have.deep.property("bbox.top");
                    expect(response).to.have.deep.property("bbox.bottom");
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
                        serverUrl: null,
                        protocol: 'XHR',
                        proxyURL: (mock) ? null : "http://localhost/proxy/php/proxy.php?url=",
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
                            x: 2.64,
                            y: 48.54
                        },
                        endPoint: {
                            x: 3.01,
                            y: 48.45
                        },
                        // viaPoints: [],
                        // provideBbox: true,
                        // exclusions: ["Tunnel", "Toll"], // "Bridge"
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
                        // description du test : envoi d'une requête GET avec les params origin, destination, calcul d'isochrone, pas d'exclusions et graph voiture (options par défaut)
                        //http://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn/itineraire/rest/route.json?origin=2.64,48.54&destination=3.01,48.45&method=TIME&graphName=Voiture&srs=EPSG:4326

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
                            requests[0].respond(200, { "Content-Type": "application/xml" }, routeResponseJson);
                        }
                    });
                });

                describe("Les options 'startPoint|endPoint' et 'exclusions' sont renseignées", function() {

                    it("TODO: exclusions = Bridge (pas implémenté par le service !)", function(done) {
                        // description du test : envoi d'une requête GET avec les params origin, destination, exclusions=bridge calcul d'isochrone, et graph voiture (options par défaut)
                        // http://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn/itineraire/rest/route.json?origin=2.64,48.54&destination=3.01,48.45&method=TIME&graphName=Voiture&srs=EPSG:4326

                        options.onSuccess = function (response) {
                            console.log(response);
                            functionResponseAssert(response);
                            done();
                        };
                        options.onFailure = function (error) {
                            console.log(error);
                            done(error);
                        };
                        //options.exclusions = ["Bridge"];

                        Gp.Services.route(options);

                        if (mock) {
                            requests[1].respond(200, { "Content-Type": "application/xml" }, routeResponseJson);
                        }
                    });

                    it("exclusions = Toll", function(done) {
                        // description du test :envoi d'une requête GET avec les params origin, destination, exclusions=Toll calcul d'isochrone, et graph voiture (options par défaut)
                        // http://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn/itineraire/rest/route.json?origin=2.64,48.54&destination=3.01,48.45&method=TIME&graphName=Voiture&srs=EPSG:4326

                        options.onSuccess = function (response) {
                            console.log(response);
                            functionResponseAssert(response);
                            done();
                        };
                        options.onFailure = function (error) {
                            console.log(error);
                            done(error);
                        };
                        options.exclusions = ["Toll"];

                        Gp.Services.route(options);

                        if (mock) {
                            requests[2].respond(200, { "Content-Type": "application/xml" }, routeResponseJsonToll);
                        }
                    });

                    xit("TODO exclusions = Tunnel", function(done) {
                        // description du test :
                    });

                    xit("TODO exclusions = Bridge, Toll, Tunnel", function(done) {
                        // description du test :
                    });

                    xit("TODO sans exclusions", function(done) {
                        // description du test :
                    });
                });

                describe("Les options 'startPoint|endPoint' et 'graph' sont renseignées", function() {

                    xit("TODO graph = Voiture", function(done) {
                        // description du test :
                    });

                    xit("TODO graph = Pieton", function(done) {
                        // description du test :
                    });

                    xit("TODO graph par defaut", function(done) {
                        // description du test :
                    });
                });

                describe("Les options 'startPoint|endPoint' et 'routePreference' sont renseignées", function() {

                    xit("TODO routePreference = fastest", function(done) {
                        // description du test :
                    });

                    xit("TODO routePreference = shortest", function(done) {
                        // description du test :
                    });

                    xit("TODO routePreference par defaut ", function(done) {
                        // description du test :
                    });
                });


                describe("Les options 'startPoint|endPoint' avec 'viaPoints' sont renseignées", function () {

                    xit("TODO ajout d'une étape", function(done) {
                        // description du test :
                    });

                    xit("TODO ajout de plusieurs points", function(done) {
                        // description du test :
                    });

                });

                describe("Utilisation des options : provideBbox, provideGeometry, distanceUnit", function () {

                    xit("TODO provideBbox par défaut", function(done) {
                        // description du test :
                    });

                    xit("TODO provideBbox = true", function(done) {
                        // description du test :
                    });

                    xit("TODO provideGeometry par défaut", function(done) {
                        // description du test :
                    });

                    xit("TODO provideGeometry = true", function(done) {
                        // description du test :
                    });

                    xit("TODO distanceUnit par défaut", function(done) {
                        // description du test :
                    });

                    xit("TODO distanceUnit = KM", function(done) {
                        // description du test :
                    });

                });
            });
        });
    });
});
