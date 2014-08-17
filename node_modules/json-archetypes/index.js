/**
 *  Data Archetypes – JSON standards for common types of data
 */

// Constructor
function DataArchetypes() {
	// Add Schemas
	this.schemas = {};
	this.schemas.product = require('./archetypes/product/product_archetype_schema');
	this.schemas.receipt = require('./archetypes/receipt/receipt_archetype_schema');
	this.schemas.image = require('./archetypes/image/image_archetype_schema');
	this.schemas.task = require('./archetypes/task/task_archetype_schema');
};

// Add Methods
DataArchetypes.prototype.newProduct = function() {
	return productInstance;
};

DataArchetypes.prototype.validateProduct = function(product, callback) {
	productValidator.validate(product, callback, function(errors, product) {
		callback(errors, product);
	});
};

module.exports = DataArchetypes;