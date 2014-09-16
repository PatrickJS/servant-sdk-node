module.exports.run = function(callback) {

	/**
	 * Test Instantiation of Archetype Instances
	 */
	var Servant = require('../index')('servant', 'servant', 'servant', 0);
	var test = require('tape');

	test('****** Test Product Instantiation', function(t) {
		var product = Servant.new('product');
		t.equal(product.title, "");
		t.end();
	});

	test('****** Test Image Instantiation', function(t) {
		var image = Servant.new('image');
		t.equal(image.caption, "");
		t.end();
	});

	test('****** Test Receipt Instantiation', function(t) {
		var receipt = Servant.new('receipt');
		t.equal(receipt.price_total, 0);
		t.end();
	});

	test('****** Test Task Instantiation', function(t) {
		var task = Servant.new('task');
		t.equal(task.task, "");
		t.end();
	});

	// Test Callback
	callback();

}