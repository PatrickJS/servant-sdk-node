module.exports.run = function(callback) {

	/**
	 * Test Instantiation of Archetype Instances
	 */
	var Servant = require('../index')('servant', 'servant', 'servant', 0);
	var test = require('tape');

	test('****** Test TinyText Instantiation', function(t) {
		var tinytext = Servant.new('tinytext');
		t.equal(tinytext.body, "");
		t.end();
	});

	test('****** Test Product Instantiation', function(t) {
		var product = Servant.new('product');
		t.equal(product.name, "");
		t.end();
	});

	test('****** Test Person Instantiation', function(t) {
		var person = Servant.new('person');
		t.equal(person.full_name, "");
		t.end();
	});


	// Test Callback
	callback();

}