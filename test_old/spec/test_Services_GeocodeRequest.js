/* 
 * Tests de la construction d'une requête de géocodage, par la classe DirectGeocodeRequestFactory.
 */
define(['chai', 'sinon'], function (chai, sinon) {

    var assert = chai.assert;
    var expect = chai.expect;
    var should = chai.should();

    describe("-- Test GeocodeRequest --", function () {

		describe('DirectGeocodeRequestFactory', function () {

            var DirectGeocodeRequestFactory;
            var XML;

            beforeEach(function (done) {
                require([
                    'Formats/XML',
					'Services/Geocode/Request/DirectGeocodeRequestFactory'],
					function (
                        _XML,
						_DirectGeocodeRequestFactory
						) {
                            XML = _XML;
                            DirectGeocodeRequestFactory = _DirectGeocodeRequestFactory;
                            done();
					});

            });

			it('Appel de la factory', function () {

				var options = {
					location : "Saint-Mandée, 94166",
					filterOptions : {
						type : ['PositionOfInterest'],
						bbox : {left: 2.40, right: 2.50, top: 49, bottom: 48}
					}
				};

                var valide =  function (result) {
                    var p = new XML();
                        p.setXMLString(result);
                    var data = p.parse();
                    should.exist(data);

                    var req = data["xls:XLS"]["xls:Request"];
                    expect(req).to.have.property("xls:GeocodeRequest");
                    expect(req["xls:GeocodeRequest"]).to.have.property("xls:Address");
                    expect(req["xls:GeocodeRequest"]["xls:Address"]["attributes"]).to.have.property("countryCode", 'PositionOfInterest');
                    expect(req["xls:GeocodeRequest"]["xls:Address"]).to.have.property("xls:freeFormAddress");
                    expect(req["xls:GeocodeRequest"]["xls:Address"]["xls:freeFormAddress"].textContent).to.equal('Saint-Mandée, 94166');
                    expect(req["xls:GeocodeRequest"]["xls:Address"]).to.have.property("gml:Envelope");
                    expect(req["xls:GeocodeRequest"]["xls:Address"]["gml:Envelope"]).to.have.property("gml:lowerCorner");
                    expect(req["xls:GeocodeRequest"]["xls:Address"]["gml:Envelope"]).to.have.property("gml:upperCorner");
                };

				var request = DirectGeocodeRequestFactory.build(options);
				valide(request);
			});
		});
	});
});
