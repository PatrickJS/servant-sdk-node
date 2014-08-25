module.exports.run = function(callback) {

	/**
	 * Test Instantiation of Archetype Instances
	 */
	var Servant = require('../index')('lkjasfas9f8a', 'asfasfasfasfasf', 'http://servant.co', 0);
	var test = require('tape');


	test('****** Test Validations Part 1', function(t) {
		var instance = Servant.newArchetype('product');
		// Test REQUIRED - Missing Seler & Title
		// Test MAXIMUM
		instance.price = 9999999999999999999999999;
		// Test MINIMUM
		instance.sale_price = -2;
		// Test ENUM
		instance.condition = 'really old';
		// Test MAXLENGTH
		instance.category = 'asfklasj l;jsalkf jsal;fj saofj als;fj sl;afj lsakjf l;asjf asf asf asf ';
		// Test PROPERTIES & ADDITIONALPROPERTIES
		instance.not_allowed = 'asfasf';
		// Test MAXITEMS
		instance.tags = ["one", "two", "three", "four", "five", "six", "seven"];
		// Test UNIQUEITEMS
		instance.audience = ["one", "one"];
		// Test TYPE
		instance.recurring_payment = 'false';
		// Test TYPE
		instance.recurring_payment = 'false';

		// Run Validation
		Servant.validateArchetype('product', instance, function(errors, instance) {
			t.equal(errors !== 'undefined', true);
			t.equal(errors.title !== 'undefined', true);
			t.equal(errors.price !== 'undefined', true);
			t.equal(errors.seller !== 'undefined', true);
			t.equal(errors.category !== 'undefined', true);
			t.equal(errors.tags !== 'undefined', true);
			t.equal(errors.audience !== 'undefined', true);
			t.equal(errors.recurring_payment !== 'undefined', true);
			t.equal(errors.sale_price !== 'undefined', true);
			t.end();
			console.log(errors);
		});
	});

	test('****** Test Validations Part 2', function(t) {
		var instance = Servant.newArchetype('receipt');
		// Test REQUIRED - Missing Seler & Title
		instance.customer_email = 'john@gm';
		instance.products = [{
			product_blah: 'asfasfasf'
		}]
		// Run Validation
		Servant.validateArchetype('receipt', instance, function(errors, instance) {
			t.equal(errors.customer_email !== 'undefined', true);
			t.end();
			console.log(errors);
		});
	});

	// Test Callback
	callback();

}