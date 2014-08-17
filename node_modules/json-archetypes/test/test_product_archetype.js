module.exports.run = function(callback) {

	/**
	 * Test Product Archetype
	 */
	var ZSchema = require("z-schema");
	var validator = new ZSchema();
	var test = require('tape');
	var DataArchetypes = require('../index');
	var DATs = new DataArchetypes();

	/**
	 * Product Archetype Schema Test
	 */

	test('****** Test Product Archetype Schema', function(t) {
		validator.validateSchema(DATs.schemas.product, function(err, report) {
			t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
			t.end();
		});
	});

	// Test Callback
	callback();

}