/*
* Tests de la construction d"une requête de géocodage inverse, par la classe GeocodeRequestFactory.
*/
import { assert } from "chai";
import { expect } from "chai";
import { should } from "chai";
should();

import XML from "../../src/Formats/XML";
import GeocodeRequestFactory from "../../src/Services/Geocode/Request/GeocodeRequestFactory";

describe("-- Test ReverseGeocodeRequest --", function () {

    describe("GeocodeRequestFactory", function () {

        it("Appel de la factory", function () {

            var options = {
                geocodeMethod : "reverse",
                searchGeometry : {
                    type: "Circle",
                    coordinates: [2.49, 49],
                    radius: 100
                },
                index: "PositionOfInterest",
                position: {
                    lon: 2.48,
                    lat: 48.9
                }
            };

            /** validation */
            var valide =  function (result) {
                expect(result).to.be.a('string');
            };

            var request = GeocodeRequestFactory.build(options);
            valide(request);
        });
    });
});
