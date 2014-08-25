module.exports.run = function(callback) {

	/**
	 * Test Task Archetype
	 */
	var ZSchema = require("z-schema");
	var validator = new ZSchema();
	var test = require('tape');
	var JATs = require('../index');


	test('****** Test Task Archetype Schema', function(t) {
		validator.validateSchema(JATs.archetypes.task, function(err, report) {
			t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
			t.end();
		});
	});

	// Test Callback
	callback();

}