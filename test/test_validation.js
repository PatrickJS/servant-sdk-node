module.exports.run = function(callback) {

	/**
	 * Test Instantiation of Archetype Instances
	 */
	var Servant = require('../index')('lkjasfas9f8a', 'asfasfasfasfasf', 'http://servant.co', 0);
	var test = require('tape');


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
		Servant.validate('product', product, function(error, product) {
			t.equal(typeof error.errors !== 'undefined', true);
			t.equal(typeof error.errors.name !== 'undefined', true);
			t.equal(typeof error.errors.price !== 'undefined', true);
			t.equal(typeof error.errors.seller !== 'undefined', true);
			t.equal(typeof error.errors.category !== 'undefined', true);
			t.equal(typeof error.errors.tags !== 'undefined', true);
			t.equal(typeof error.errors.audience !== 'undefined', true);
			t.equal(typeof error.errors.recurring_payment !== 'undefined', true);
			t.equal(typeof error.errors.sale_price !== 'undefined', true);
			t.end();
		});
	});

	test('****** Test Validations – Person', function(t) {
		var person = Servant.new('person');
		// Test PROPERTY NOT ALLOWED & INVALID TYPES
		person = {
			name: "Jack Smith",
			phone_numbers: [{ phone_number: 801284127414, invalid_property: 'whoo!' }],
			_id: 'yes!'
		}
		// Run Validation
		Servant.validate('person', person, function(error, personvalidated) {
			console.log(error, error.errors.phone_numbers, personvalidated)
			t.end();
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
		product.images = [{
			title: 'a great image',
			large_resolution: 'http://largeimage.com'
		}, {
			title: 'a great image',
			large_resolution: 'http://largeimage.com'
		}];
		// Run Validation
		Servant.validate('product', product, function(error, product) {
			t.equal(typeof error.errors.images['0'] !== 'undefined', true);
			t.equal(typeof error.errors.images['1'] !== 'undefined', true);
			t.equal(typeof error.errors.images !== 'undefined', true);
			t.end();
		});
	});

	// Test Callback
	callback();

}