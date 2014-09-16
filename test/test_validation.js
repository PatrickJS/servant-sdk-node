module.exports.run = function(callback) {

	/**
	 * Test Instantiation of Archetype Instances
	 */
	var Servant = require('../index')('lkjasfas9f8a', 'asfasfasfasfasf', 'http://servant.co', 0);
	var test = require('tape');


	test('****** Test Validations Part 1', function(t) {
		// Test validating a NON-OBJECT

		// Run Validation
		Servant.validate('receipt', ['yada', 'aslfjaslf'], function(errors, receipt1) {
			t.equal(typeof errors !== 'undefined', true);
			t.equal(typeof errors.schema !== 'undefined', true);
			console.log(errors);
			t.end();
		});
	});


	test('****** Test Validations Part 2', function(t) {
		var product = Servant.new('product');
		// Test REQUIRED - Missing Seler & Title
		// Test MAXIMUM
		product.price = 9999999999999999999999999;
		// Test MINIMUM
		product.sale_price = -2;
		// Test ENUM
		product.condition = 'really old';
		// Test MAXLENGTH
		product.category = 'asfklasj l;jsalkf jsal;fj saofj als;fj sl;afj lsakjf l;asjf asf asf asf ';
		// Test PROPERTIES & ADDITIONALPROPERTIES
		product.not_allowed = 'asfasf';
		// Test MAXITEMS
		product.tags = ["one", "two", "three", "four", "five", "six", "seven"];
		// Test MAXLENGTH in Array
		product.variations = ['hi', 'alksjfl;ajksfl;kasjfjasfl;jasl;j sal;kjf lk;sajf ;kljlksjfl;ajksfl;kasjfjasfl;jasl;j sal;kjf lk;sajf ;kljlksjfl;ajksfl;kasjfjasfl;jasl;j sal;kjf lk;sajf ;kljlksjfl;ajksfl;kasjfjasfl;jasl;j sal;kjf lk;sajf ;kljlksjfl;ajksfl;kasjfjasfl;jasl;j sal;kjf lk;sajf ;kljlksjfl;ajksfl;kasjfjasfl;jasl;j sal;kjf lk;sajf ;kljlksjfl;ajksfl;kasjfjasfl;jasl;j sal;kjf lk;sajf ;kljlksjfl;ajksfl;kasjfjasfljf lk;sajf ;kljlksjfl;ajksfl;kasjfjasfljf lk;sajf ;kljlksjfl;ajksfl;kasjfjasfljf lk;sajf ;kljlksjfl;ajksfl;kasjfjasfl;jasl;j sal;kjf lk;sajf ;kljsa;l ', 'yo']
		// Test UNIQUEITEMS
		product.audience = ["one", "one"];
		// Test TYPE
		product.recurring_payment = 'false';
		// Test TYPE
		product.recurring_payment = 'false';

		// Run Validation
		Servant.validate('product', product, function(errors, product) {
			t.equal(typeof errors !== 'undefined', true);
			t.equal(typeof errors.title !== 'undefined', true);
			t.equal(typeof errors.price !== 'undefined', true);
			t.equal(typeof errors.seller !== 'undefined', true);
			t.equal(typeof errors.category !== 'undefined', true);
			t.equal(typeof errors.tags !== 'undefined', true);
			t.equal(typeof errors.variations_array['1'] !== 'undefined', true);
			t.equal(typeof errors.audience !== 'undefined', true);
			t.equal(typeof errors.recurring_payment !== 'undefined', true);
			t.equal(typeof errors.sale_price !== 'undefined', true);
			t.end();
			console.log(errors);
		});
	});

	test('****** Test Validations Part 3', function(t) {
		var receipt = Servant.new('receipt');
		// Test FORMAT DATETIME
		receipt.transaction_date = 'asfkljasf';
		// Test FORMAT EMAIL
		receipt.shipping_email = 'blah'
		receipt.customer_email = 'john@gmail.com';
		// Test MINITEMS
		receipt.products = []
		// Run Validation
		Servant.validate('receipt', receipt, function(errors, receipt) {
			t.equal(typeof errors.customer_email === 'undefined', true);
			t.equal(typeof errors.shipping_email !== 'undefined', true);
			t.equal(typeof errors.products !== 'undefined', true);
			t.end();
			console.log(errors);
		});
	});

	test('****** Test Validations Part 4', function(t) {
		var receipt1 = Servant.new('receipt');
		// Test PROPERTY NOT ALLOWED & INVALID TYPES
		receipt1.products = [{
			product_archetype_id: 'asfjasl;jfasf',
			product_quantity: 'asfasf',
			product_price: 'asfljk',
			product_blah: 'asfasfasf'
		}];
		// Run Validation
		Servant.validate('receipt', receipt1, function(errors, receipt1) {
			t.equal(typeof errors.products_array['0'].product_blah !== 'undefined', true);
			t.equal(typeof errors.products_array['0'].product_price !== 'undefined', true);
			t.equal(typeof errors.products_array['0'].product_quantity !== 'undefined', true);
			t.end();
			console.log(errors);
		});
	});

	test('****** Test Nested Archetype Errors', function(t) {
		var product = Servant.new('product');
		// Add Invalid Nested Archetypes
		product.primary_image_archetype = {
			title: 'a great image',
			large_resolution: 'http://largeimage.com'
		};
		// Add Invalid & Duplicate Nested Archetypes
		product.image_archetypes = [{
			title: 'a great image',
			large_resolution: 'http://largeimage.com'
		}, {
			title: 'a great image',
			large_resolution: 'http://largeimage.com'
		}];
		// Run Validation
		Servant.validate('product', product, function(errors, product) {
			t.equal(typeof errors.image_archetypes_array['0'] !== 'undefined', true);
			t.equal(typeof errors.image_archetypes_array['1'] !== 'undefined', true);
			t.equal(typeof errors.image_archetypes !== 'undefined', true);
			t.equal(typeof errors.primary_image_archetype !== 'undefined', true);
			t.end();
			console.log(errors);
		});
	});

	// Test Callback
	callback();

}