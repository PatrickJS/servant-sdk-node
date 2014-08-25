// Dependencies
var async = require('async');

// Require Tests
var test_instantiation = require('./test_instantiation');
var test_validation = require('./test_validation');

// Tests Array
var tests = [
	test_instantiation,
	test_validation
];

// Perform Tests
async.eachSeries(tests, function(test, testCallback) {
	test.run(function() {
		testCallback();
	});
}, function() {
	console.log("****** Tests Completed ******");
});