/*
* Tests sur les propriétés de la classe de réponse de calcul d'isochrones (ProcessIsoCurveResponse).
*/
import { expect } from "chai";
import { should } from "chai";
should();

import ProcessIsoCurveResponse from "../../src/Services/ProcessIsoCurve/Response/model/ProcessIsoCurveResponse";

describe("-- Tests ProcessIsoCurveResponse --", function () {

    describe("-- ProcessIsoCurveResponse", function () {

        it("attributs de ProcessIsoCurveResponse()", function () {
            var p = new ProcessIsoCurveResponse();
            should().exist(p);

            expect(p).to.have.property("message");
            expect(p).to.have.property("id");
            expect(p).to.have.property("location");
            expect(p.location).to.be.an("object");
            expect(p.location).to.have.property("x");
            expect(p.location).to.have.property("y");
            expect(p).to.have.property("srs");
            expect(p).to.have.property("geometry");
            expect(p).to.have.property("time");
            expect(p).to.have.property("distance");
        });
    });
});
