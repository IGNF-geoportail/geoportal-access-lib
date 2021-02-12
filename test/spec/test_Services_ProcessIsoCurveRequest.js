/*
* Tests de la construction d"une requête de calcul d"isochrones, par la classe ProcessIsoCurveRequest.
*/
import { expect } from "chai";
import { should } from "chai";
should();

import ProcessIsoCurveRequest from "../../src/Services/ProcessIsoCurve/Request/ProcessIsoCurveRequest";

describe("-- Test ProcessIsoCurveRequest --", function () {

    it("ProcessIsoCurveRequest : mode GET", function () {

        // ex. http://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn/isochrone/isochrone.json?location=-1.557189,47.217122&method=distance&distance=5000&graphName=Voiture
        var options = {
            httpMethod : "GET", // GET|POST
            // spécifique au service
            resource: "bduni-idf-osrm",
            position : {
                x : 2.3242664298058053,
                y : 48.86118017324745
            },
            graph : "car",
            method : "time",
            time : 1000, 
            reverse : false,
            srs : "EPSG:4326",
            timeUnit:"standard",
            distanceUnit: "km",
            constraints: {constraintType:'banned',key:'ways_type',operator:'=',value:'autoroute'}
        };

        try {

            var oIsoCurve = new ProcessIsoCurveRequest(options);
            if (!oIsoCurve.processRequestString()) {
                expect(false).to.be.true;
            }

            var request = oIsoCurve.requestString;
            expect(request).not.to.be.null;
            console.log(request);
            // point=2.3242664298058053,48.86118017324745&direction=departure&costType=time&costValue=1000&profile=car&constraints=...&crs=EPSG:4326
            var values = request.split(/&/);
            var map = {};
            for (var i = 0; i < values.length; i++) {
                var val = values[i].split(/=/);
                map[val[0]] = val[1];
            }

            expect(map).to.have.property("resource");
            expect(map).to.have.property("point");
            expect(map).to.have.property("direction");
            expect(map).to.have.property("costValue");
            expect(map).to.have.property("costType");
            expect(map).to.have.property("profile");
            expect(map).to.have.property("constraints");
            expect(map).to.have.property("crs");

        } catch (e) {
            console.log(e);
            expect(false).to.be.true;
        }
    });

    it("ProcessIsoCurveRequest : mode POST", function () {

        // ex. http://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn/isochrone/isochrone.json?location=-1.557189,47.217122&method=distance&distance=5000&graphName=Voiture
        var options = {
            httpMethod : "POST", // GET|POST
            // spécifique au service
            resource: "bduni-idf-osrm",
            position : {
                x : 2.3242664298058053,
                y : 48.86118017324745
            },
            graph : "pedestrian",
            method : "distance",
            distance : 200,
            reverse : true,
            srs : "EPSG:4326",
            timeUnit:"standard",
            distanceUnit: "km",
            constraints: {constraintType:'banned',key:'ways_type',operator:'=',value:'autoroute'}
        };

        /** validation */
        var valide = function (result) {
            var req = JSON.parse(result);
            should().exist(req);
            // console.log(req);

            expect(req).to.have.property("resource");
            expect(req).to.have.property("constraints");
            expect(req).to.have.property("profile");
            expect(req).to.have.property("point");
            expect(req).to.have.property("costType");
            expect(req).to.have.property("costValue");
            expect(req).to.have.property("direction");
            expect(req).to.have.property("crs");

        };

        try {

            var oIsoCurve = new ProcessIsoCurveRequest(options);
            if (!oIsoCurve.processRequestString()) {
                expect(false).to.be.true;
            }

            var request = oIsoCurve.requestString;
            expect(request).not.to.be.null;
            valide(request);

        } catch (e) {
            console.log(e);
            expect(false).to.be.true;
        }
    });
});
