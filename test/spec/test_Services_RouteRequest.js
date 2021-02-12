/*
* Tests de la construction d"une requête de calcul d"itinéraires, à partir d"options, par la classe RouteRequestFactory.
*/
import { assert } from "chai";
import { expect } from "chai";
import { should } from "chai";
should();

import XML from "../../src/Formats/XML";
import RouteRequestFactory from "../../src/Services/Route/Request/RouteRequestFactory";

describe("-- Test RouteRequest --", function () {

    describe("RouteRequest", function () {

        it("Appel de la factory : en mode REST avec options minimales", function () {

            var options = {
                onSuccess : function (response) {
                    console.log(response);
                },
                onFailure : function (error) {
                    console.log(error);
                },
                // spécifique au service
                resource : "bduni-idf-osrm",
                startPoint : {
                    x : 2.64,
                    y : 48.54
                },
                endPoint : {
                    x : 3.01,
                    y : 48.45
                }
            };

            /** validation */
            var valide =  function (result) {
                expect(result).to.be.equal("resource=bduni-idf-osrm&start=2.64,48.54&end=3.01,48.45&geometryFormat=geojson");
            };

            var request = RouteRequestFactory.build(options);
            valide(request);

        });

        it("Appel de la factory : mode REST avec options plus complet", function () {

            var options = {
                onSuccess : function (response) {
                    console.log(response);
                },
                onFailure : function (error) {
                    console.log(error);
                },
                // spécifique au service
                resource: "bduni-idf-osrm",
                startPoint : {
                    x : 2.64,
                    y : 48.54
                },
                endPoint : {
                    x : 3.01,
                    y : 48.45
                },
                viaPoints : [
                    {
                        x : 3.02,
                        y : 48.46
                    }
                ],
                provideBbox : true,
                constraints : [{"constraintType":"banned","key":"wayType","operator":"=","value":"tunnel"},{"constraintType":"banned","key":"wayType","operator":"=","value":"pont"},{"constraintType":"banned","key":"wayType","operator":"=","value":"autoroute"}],
                distanceUnit : "m",
                timeUnit : "second",
                graph : "car",
                geometryInInstructions : true,
                routePreference : "shortest",
                srs : "EPSG:4326",
                waysAttributes : ["name"]
            };

            /** validation */
            var valide =  function (result) {
                expect(result).to.be.equal('resource=bduni-idf-osrm&start=2.64,48.54&end=3.01,48.45&geometryFormat=geojson&optimization=shortest&intermediates=3.02,48.46&profile=car&constraints={"constraintType":"banned","key":"wayType","operator":"=","value":"tunnel"}|{"constraintType":"banned","key":"wayType","operator":"=","value":"pont"}|{"constraintType":"banned","key":"wayType","operator":"=","value":"autoroute"}&crs=EPSG:4326&distanceUnit=meter&timeUnit=second&waysAttributes=name');
            };

            var request = RouteRequestFactory.build(options);
            valide(request);

        });
    });
});
