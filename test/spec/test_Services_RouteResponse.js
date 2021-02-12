/*
* Tests sur les propriétés de la classe de réponse de calcul d'itinéraires (RouteResponse).
*/
import { assert } from "chai";
import { expect } from "chai";
import { should } from "chai";
should();

import RouteResponse from "../../src/Services/Route/Response/model/RouteResponse";
import RouteInstruction from "../../src/Services/Route/Response/model/RouteInstruction";

describe("-- Tests RouteResponse --", function () {

    describe("-- test de l'objet RouteResponse en sortie", function () {

        it("attributs de RouteResponse()", function () {
            var r = new RouteResponse();
            should().exist(r);

            expect(r).to.have.property("totalTime");
            expect(r).to.have.property("totalDistance");
            expect(r).to.have.property("bbox");
            expect(r.bbox).to.be.an("object");
            expect(r.bbox).to.have.property("left");
            expect(r.bbox).to.have.property("right");
            expect(r.bbox).to.have.property("top");
            expect(r.bbox).to.have.property("bottom");
            expect(r).to.have.property("routeGeometry");
            expect(r).to.have.property("routeInstructions");
            expect(r.routeInstructions).to.be.an("array");
        });

        it("attributs de RouteInstruction()", function () {
            var r = new RouteInstruction();
            should().exist(r);

            expect(r).to.have.property("duration");
            expect(r).to.have.property("distance");
            expect(r).to.have.property("code");
            expect(r).to.have.property("instruction");
        });

    });

});
