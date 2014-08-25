/**
 * Validate Data Archetypes
 */

var jsonarchetypes = require('json-archetypes');
var FormatValidators = require('./format_validators');
var Utils = require('./utils');

var JsonValidators = {
	// multipleOf: function(report, schema, json, property) {
	// 	// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.1.2
	// 	if (typeof json !== "number") {
	// 		return;
	// 	}
	// 	if (Utils.whatIs(json / schema.multipleOf) !== "integer") {
	// 		report.addError("MULTIPLE_OF", [json, schema.multipleOf]);
	// 	}
	// },
	maximum: function(report, schema, json, property) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.2.2
		if (typeof json !== "number") {
			return;
		}
		if (schema.exclusiveMaximum !== true) {
			if (json > schema.maximum) {
				report.errors[property] = property + ' must be less than or equal to ' + schema.maximum;
			}
		} else {
			if (json >= schema.maximum) {
				report.errors[property] = property + ' must be less than or equal to ' + schema.maximum;
			}
		}
	},
	exclusiveMaximum: function() {
		// covered in maximum
	},
	minimum: function(report, schema, json, property) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.3.2
		if (typeof json !== "number") {
			return;
		}
		if (schema.exclusiveMinimum !== true) {
			if (json < schema.minimum) {
				report.errors[property] = property + ' must be more than or equal to ' + schema.minimum;
			}
		} else {
			if (json <= schema.minimum) {
				report.errors[property] = property + ' must be more than or equal to ' + schema.minimum;
			}
		}
	},
	exclusiveMinimum: function() {
		// covered in minimum
	},
	maxLength: function(report, schema, json, property) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.1.2
		if (typeof json !== "string") {
			return;
		}
		if (json.length > schema.maxLength) {
			report.errors[property] = property + ' must be less than ' + schema.maxLength + ' characters';
		}
	},
	minLength: function(report, schema, json, property) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.2.2
		if (typeof json !== "string") {
			return;
		}
		if (json.length < schema.minLength) {
			report.errors[property] = property + ' must be more than ' + schema.minLength + ' characters';
		}
	},
	// pattern: function(report, schema, json, property) {
	// 	// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.3.2
	// 	if (typeof json !== "string") {
	// 		return;
	// 	}
	// 	if (RegExp(schema.pattern).test(json) === false) {
	// 		report.addError("PATTERN", [schema.pattern, json]);
	// 	}
	// },
	additionalItems: function(report, schema, json) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.1.2
		if (!Array.isArray(json)) {
			return;
		}
		// if the value of "additionalItems" is boolean value false and the value of "items" is an array,
		// the json is valid if its size is less than, or equal to, the size of "items".
		if (schema.additionalItems === false && Array.isArray(schema.items)) {
			if (json.length > schema.items.length) {
				report.addError("ARRAY_ADDITIONAL_ITEMS");
			}
		}
	},
	items: function() { /*report, schema, json*/
		// covered in additionalItems
	},
	maxItems: function(report, schema, json, property) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.2.2
		if (!Array.isArray(json)) {
			return;
		}
		if (json.length > schema.maxItems) {
			report.errors[property] = 'Only ' + schema.maxItems + ' or less are allowed';
		}
	},
	minItems: function(report, schema, json, property) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.3.2
		if (!Array.isArray(json)) {
			return;
		}
		if (json.length < schema.minItems) {
			report.errors[property] = 'Only ' + schema.minItems + ' or more are allowed';
		}
	},
	uniqueItems: function(report, schema, json, property) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.4.2
		if (!Array.isArray(json)) {
			return;
		}
		if (schema.uniqueItems === true) {
			var matches = [];
			if (Utils.isUniqueArray(json, matches) === false) {
				report.errors[property] = 'No duplicates are allowed';
			}
		}
	},
	// maxProperties: function(report, schema, json, property) {
	// 	// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.1.2
	// 	if (Utils.whatIs(json) !== "object") {
	// 		return;
	// 	}
	// 	var keysCount = Object.keys(json).length;
	// 	if (keysCount > schema.maxProperties) {
	// 		report.addError("OBJECT_PROPERTIES_MAXIMUM", [keysCount, schema.maxProperties]);
	// 	}
	// },
	// minProperties: function(report, schema, json, property) {
	// 	// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.2.2
	// 	if (Utils.whatIs(json) !== "object") {
	// 		return;
	// 	}
	// 	var keysCount = Object.keys(json).length;
	// 	if (keysCount < schema.minProperties) {
	// 		report.addError("OBJECT_PROPERTIES_MINIMUM", [keysCount, schema.minProperties]);
	// 	}
	// },
	required: function(report, schema, json) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.3.2
		if (Utils.whatIs(json) !== "object") {
			return;
		}
		var idx = schema.required.length;
		while (idx--) {
			var requiredPropertyName = schema.required[idx];
			if (json[requiredPropertyName] === undefined || json[requiredPropertyName] === "") {
				report.errors[requiredPropertyName] = requiredPropertyName + ' is required';
			}
		}
	},
	additionalProperties: function(report, schema, json, property) {
		console.log("here", json)
		// covered in properties and patternProperties
		if (schema.properties === undefined && schema.patternProperties === undefined) {
			return JsonValidators.properties.call(this, report, schema, json);
		}
	},
	patternProperties: function(report, schema, json, property) {
		// covered in properties
		if (schema.properties === undefined) {
			return JsonValidators.properties.call(this, report, schema, json);
		}
	},
	// Checks for additional properties
	properties: function(report, schema, json, property) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.4.2
		if (Utils.whatIs(json) !== "object") {
			return;
		}
		var properties = schema.properties !== undefined ? schema.properties : {};
		var patternProperties = schema.patternProperties !== undefined ? schema.patternProperties : {};
		if (schema.additionalProperties === false) {
			// The property set of the json to validate.
			var s = Object.keys(json);
			// The property set from "properties".
			var p = Object.keys(properties);
			// The property set from "patternProperties".
			var pp = Object.keys(patternProperties);
			// remove from "s" all elements of "p", if any;
			s = Utils.difference(s, p);
			// for each regex in "pp", remove all elements of "s" which this regex matches.
			var idx = pp.length;
			while (idx--) {
				var regExp = RegExp(pp[idx]),
					idx2 = s.length;
				while (idx2--) {
					if (regExp.test(s[idx2]) === true) {
						s.splice(idx2, 1);
					}
				}
			}
			// Validation of the json succeeds if, after these two steps, set "s" is empty.
			if (s.length > 0) {
				s.forEach(function(prop, index) {
					report.errors[prop] = prop + ' is not allowed';
				});
			}
		}
	},
	// dependencies: function(report, schema, json) {
	// 	// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.5.2
	// 	if (Utils.whatIs(json) !== "object") {
	// 		return;
	// 	}

	// 	var keys = Object.keys(schema.dependencies),
	// 		idx = keys.length;

	// 	while (idx--) {
	// 		// iterate all dependencies
	// 		var dependencyName = keys[idx];
	// 		if (json[dependencyName]) {
	// 			var dependencyDefinition = schema.dependencies[dependencyName];
	// 			if (Utils.whatIs(dependencyDefinition) === "object") {
	// 				// if dependency is a schema, validate against this schema
	// 				exports.validate.call(this, report, dependencyDefinition, json);
	// 			} else { // Array
	// 				// if dependency is an array, object needs to have all properties in this array
	// 				var idx2 = dependencyDefinition.length;
	// 				while (idx2--) {
	// 					var requiredPropertyName = dependencyDefinition[idx2];
	// 					if (json[requiredPropertyName] === undefined) {
	// 						report.addError("OBJECT_DEPENDENCY_KEY", [requiredPropertyName, dependencyName]);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// },
	enum: function(report, schema, json, property) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.1.2
		var match = false,
			idx = schema.enum.length;
		while (idx--) {
			if (Utils.areEqual(json, schema.enum[idx])) {
				match = true;
				break;
			}
		}
		if (match === false) {
			report.errors[property] = json + ' is not one of the allowed options';
		}
	},
	type: function(report, schema, json, property) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.2.2
		var jsonType = Utils.whatIs(json);
		if (typeof schema.type === "string") {
			if (jsonType !== schema.type && (jsonType !== "integer" || schema.type !== "number")) {
				report.errors[property] = 'Invalid type';
			}
		} else {
			if (schema.type.indexOf(jsonType) === -1 && (jsonType !== "integer" || schema.type.indexOf("number") === -1)) {
				report.errors[property] = 'Invalid type';
			}
		}
	},
	// allOf: function(report, schema, json) {
	// 	// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.3.2
	// 	var idx = schema.allOf.length;
	// 	while (idx--) {
	// 		if (exports.validate.call(this, report, schema.allOf[idx], json) === false) {
	// 			break;
	// 		}
	// 	}
	// },
	// anyOf: function(report, schema, json) {
	// 	// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.4.2
	// 	var subReports = [],
	// 		passed = false,
	// 		idx = schema.anyOf.length;

	// 	while (idx-- && passed === false) {
	// 		var subReport = new Report(report);
	// 		subReports.push(subReport);
	// 		passed = exports.validate.call(this, subReport, schema.anyOf[idx], json);
	// 	}

	// 	if (passed === false) {
	// 		report.addError("ANY_OF_MISSING", undefined, subReports);
	// 	}
	// },
	// oneOf: function(report, schema, json) {
	// 	// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.5.2
	// 	var passes = 0,
	// 		subReports = [],
	// 		idx = schema.oneOf.length;

	// 	while (idx--) {
	// 		var subReport = new Report(report);
	// 		subReports.push(subReport);
	// 		if (exports.validate.call(this, subReport, schema.oneOf[idx], json) === true) {
	// 			passes++;
	// 		}
	// 	}

	// 	if (passes === 0) {
	// 		report.addError("ONE_OF_MISSING", undefined, subReports);
	// 	} else if (passes > 1) {
	// 		report.addError("ONE_OF_MULTIPLE");
	// 	}
	// },
	// not: function(report, schema, json) {
	// 	// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.6.2
	// 	var subReport = new Report(report);
	// 	if (exports.validate.call(this, subReport, schema.not, json) === true) {
	// 		report.addError("NOT_PASSED");
	// 	}
	// },
	definitions: function() { /*report, schema, json*/
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.7.2
		// nothing to do here
	},
	format: function(report, schema, json, property) {
		// http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.2
		if (json !== "") {
			var formatValidatorFn = FormatValidators[schema.format];
			if (typeof formatValidatorFn === "function") {
				if (formatValidatorFn.length === 2) {
					// async
					report.addAsyncTask(formatValidatorFn, [json], function(result) {
						if (result !== true) {
							report.errors[property] = property + ' is not formatted correctly';
						}
					});
				} else {
					// sync
					if (formatValidatorFn.call(this, json) !== true) {
						report.errors[property] = property + ' is not formatted correctly';
					}
				}
			} else {
				report.errors[property] = property + ' has an unknown format';
			}
		}
	}
};



var recurseObject = function(report, schema, json) {
	// http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3

	// If "additionalProperties" is absent, it is considered present with an empty schema as a value.
	// In addition, boolean value true is considered equivalent to an empty schema.
	var additionalProperties = schema.additionalProperties;
	if (additionalProperties === true || additionalProperties === undefined) {
		additionalProperties = {};
	}

	// p - The property set from "properties".
	var p = schema.properties ? Object.keys(schema.properties) : [];


	// m - The property name of the child.
	var keys = Object.keys(json),
		idx = keys.length;

	while (idx--) {
		var m = keys[idx],
			propertyValue = json[m];

		// s - The set of schemas for the child instance.
		var s = [];

		// If set "p" contains value "m", then the corresponding schema in "properties" is added to "s".
		if (p.indexOf(m) !== -1) {
			s.push(schema.properties[m]);
		}

		// Instance property value must pass all schemas from s
		idx2 = s.length;
		while (idx2--) {
			report.path.push(m);
			validate.call(report, s[idx2], propertyValue);
			report.path.pop();
		}
	}
};


module.exports = function(name, instance, callback) {

	// Check parameters
	if (name === null || typeof name !== 'string') throw new Error('Servant SDK Error - You did not include an Archetype name to validate');
	if (instance === null || typeof instance !== 'object') throw new Error('Servant SDK Error - You did not include an instance object to validate');


	var schema = jsonarchetypes[name];

	// Create Report
	var report = {
		errors: {},
		nested: []
	};

	// Validate Root Schema
	var keys = Object.keys(schema);
	var idx = keys.length;
	while (idx--) {
		if (JsonValidators[keys[idx]]) {
			JsonValidators[keys[idx]](report, schema, instance);
		}
	}

	// Validate Root Properties - Go through properties in the instance
	for (prop in instance) {
		// Go through the Archetype Schema Validations for each of the properties in the instance
		for (validation in schema.properties[prop]) {
			// Description & Default properties do not need to be validated
			if (validation !== 'description' && validation !== 'default' && typeof report.errors[prop] === 'undefined') {
				JsonValidators[validation](report, schema.properties[prop], instance[prop], prop);
			}
			// Add Nested Properties
			if (schema.properties[prop].type && schema.properties[prop].type === 'array' && report.nested.indexOf(prop) === -1 && instance[prop].length) {
				report.nested.push(prop);
			}
		}
	}

	// Validate Items In Each Nested Array
	for (var i = 0, len = report.nested.length; i < len; i++) {
		// Validate Nested Root Schema
		var nestedProperty = report.nested[i];
		var keys1 = Object.keys(schema.properties[nestedProperty].items);
		var idx1 = keys1.length;

		while (idx1--) {
			if (validation !== 'description' && validation !== 'default' && typeof report.errors[prop] === 'undefined') {
				JsonValidators[keys1[idx1]](report, schema.properties[nestedProperty].items, instance[nestedProperty]);
			}
		}

	}



	// Callback
	var errors = Object.keys(report.errors);
	if (errors.length) {
		// Uppercase error messages and replace underscores with spaces for neatness 
		for (property in report.errors) {
			report.errors[property] = report.errors[property].charAt(0).toUpperCase() + report.errors[property].slice(1).replace(/_/g, ' ');
		}
		// Callback
		callback(report, null);
	} else {
		// Callback
		callback(null, instance);
	}

};



// var handled = {
// 	'type': true,
// 	'not': true,
// 	'anyOf': true,
// 	'allOf': true,
// 	'oneOf': true,
// 	'$ref': true,
// 	'$schema': true,
// 	'id': true,
// 	'exclusiveMaximum': true,
// 	'exclusiveMininum': true,
// 	'properties': true,
// 	'patternProperties': true,
// 	'additionalProperties': true,
// 	'items': true,
// 	'additionalItems': true,
// 	'required': true,
// 	'default': true,
// 	'title': true,
// 	'description': true,
// 	'definitions': true,
// 	'dependencies': true
// };

// // Tell if values match the specified type
// var fieldType = {
// 	'null': function(x) {
// 		return x === null;
// 	},
// 	'string': function(x) {
// 		return typeof x === 'string';
// 	},
// 	'boolean': function(x) {
// 		return typeof x === 'boolean';
// 	},
// 	'number': function(x) {
// 		return typeof x === 'number' && !isNaN(x);
// 	},
// 	'integer': function(x) {
// 		return typeof x === 'number' && x % 1 === 0;
// 	},
// 	'object': function(x) {
// 		return x && typeof x === 'object' && !Array.isArray(x);
// 	},
// 	'array': function(x) {
// 		return Array.isArray(x);
// 	},
// 	'date': function(x) {
// 		return x instanceof Date;
// 	}
// };

// // missing: uri, date-time, ipv4, ipv6
// var fieldFormat = {
// 	'alpha': function(v) {
// 		return (/^[a-zA-Z]+$/).test(v);
// 	},
// 	'alphanumeric': function(v) {
// 		return (/^[a-zA-Z0-9]+$/).test(v);
// 	},
// 	'identifier': function(v) {
// 		return (/^[-_a-zA-Z0-9]+$/).test(v);
// 	},
// 	'hexadecimal': function(v) {
// 		return (/^[a-fA-F0-9]+$/).test(v);
// 	},
// 	'numeric': function(v) {
// 		return (/^[0-9]+$/).test(v);
// 	},
// 	'date-time': function(v) {
// 		return !isNaN(Date.parse(v)) && v.indexOf('/') === -1;
// 	},
// 	'uppercase': function(v) {
// 		return v === v.toUpperCase();
// 	},
// 	'lowercase': function(v) {
// 		return v === v.toLowerCase();
// 	},
// 	'hostname': function(v) {
// 		return v.length < 256 && (/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/).test(v);
// 	},
// 	'uri': function(v) {
// 		return (/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/).test(v);
// 	},
// 	'email': function(v) { // email, ipv4 and ipv6 adapted from node-validator
// 		return (/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/).test(v);
// 	},
// 	'ipv4': function(v) {
// 		if ((/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/).test(v)) {
// 			var parts = v.split('.').sort();
// 			if (parts[3] <= 255)
// 				return true;
// 		}
// 		return false;
// 	},
// 	'ipv6': function(v) {
// 		return (/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/).test(v);
// 		/*  return (/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/).test(v); */
// 	}
// };

// var fieldValidate = {
// 	'readOnly': function(v, p) {
// 		return false;
// 	},
// 	// ****** numeric validation ********
// 	'minimum': function(v, p, schema) {
// 		return !(v < p || schema.exclusiveMinimum && v <= p);
// 	},
// 	'maximum': function(v, p, schema) {
// 		return !(v > p || schema.exclusiveMaximum && v >= p);
// 	},
// 	'multipleOf': function(v, p) {
// 		return (v / p) % 1 === 0 || typeof v !== 'number';
// 	},
// 	// ****** string validation ******
// 	'pattern': function(v, p) {
// 		if (typeof v !== 'string')
// 			return true;
// 		var pattern, modifiers;
// 		if (typeof p === 'string')
// 			pattern = p;
// 		else {
// 			pattern = p[0];
// 			modifiers = p[1];
// 		}
// 		var regex = new RegExp(pattern, modifiers);
// 		return regex.test(v);
// 	},
// 	'minLength': function(v, p) {
// 		return v.length >= p || typeof v !== 'string';
// 	},
// 	'maxLength': function(v, p) {
// 		return v.length <= p || typeof v !== 'string';
// 	},
// 	// ***** array validation *****
// 	'minItems': function(v, p) {
// 		return v.length >= p || !Array.isArray(v);
// 	},
// 	'maxItems': function(v, p) {
// 		return v.length <= p || !Array.isArray(v);
// 	},
// 	'uniqueItems': function(v, p) {
// 		var hash = {},
// 			key;
// 		for (var i = 0, len = v.length; i < len; i++) {
// 			key = JSON.stringify(v[i]);
// 			if (hash.hasOwnProperty(key))
// 				return false;
// 			else
// 				hash[key] = true;
// 		}
// 		return true;
// 	},
// 	// ***** object validation ****
// 	'minProperties': function(v, p) {
// 		if (typeof v !== 'object')
// 			return true;
// 		var count = 0;
// 		for (var attr in v)
// 			if (v.hasOwnProperty(attr)) count = count + 1;
// 		return count >= p;
// 	},
// 	'maxProperties': function(v, p) {
// 		if (typeof v !== 'object')
// 			return true;
// 		var count = 0;
// 		for (var attr in v)
// 			if (v.hasOwnProperty(attr)) count = count + 1;
// 		return count <= p;
// 	},
// 	// ****** all *****
// 	'enum': function(v, p) {
// 		var i, len, vs;
// 		if (typeof v === 'object') {
// 			vs = JSON.stringify(v);
// 			for (i = 0, len = p.length; i < len; i++)
// 				if (vs === JSON.stringify(p[i]))
// 					return true;
// 		} else {
// 			for (i = 0, len = p.length; i < len; i++)
// 				if (v === p[i])
// 					return true;
// 		}
// 		return false;
// 	}
// };

// var normalizeID = function(id) {
// 	return id.indexOf("://") === -1 ? id : id.split("#")[0];
// };

// var resolveURI = function(env, schema_stack, uri) {
// 	var curschema, components, hash_idx, name;

// 	hash_idx = uri.indexOf('#');

// 	if (hash_idx === -1) {
// 		if (!env.schema.hasOwnProperty(uri))
// 			return null;
// 		return [env.schema[uri]];
// 	}

// 	if (hash_idx > 0) {
// 		name = uri.substr(0, hash_idx);
// 		uri = uri.substr(hash_idx + 1);
// 		if (!env.schema.hasOwnProperty(name)) {
// 			if (schema_stack && schema_stack[0].id === name)
// 				schema_stack = [schema_stack[0]];
// 			else
// 				return null;
// 		} else
// 			schema_stack = [env.schema[name]];
// 	} else {
// 		if (!schema_stack)
// 			return null;
// 		uri = uri.substr(1);
// 	}

// 	if (uri === '')
// 		return [schema_stack[0]];

// 	if (uri.charAt(0) === '/') {
// 		uri = uri.substr(1);
// 		curschema = schema_stack[0];
// 		components = uri.split('/');
// 		while (components.length > 0) {
// 			if (!curschema.hasOwnProperty(components[0]))
// 				return null;
// 			curschema = curschema[components[0]];
// 			schema_stack.push(curschema);
// 			components.shift();
// 		}
// 		return schema_stack;
// 	} else // FIX: should look for subschemas whose id matches uri
// 		return null;
// };

// var resolveObjectRef = function(object_stack, uri) {
// 	var components, object, last_frame = object_stack.length - 1,
// 		skip_frames, frame, m = /^(\d+)/.exec(uri);

// 	if (m) {
// 		uri = uri.substr(m[0].length);
// 		skip_frames = parseInt(m[1], 10);
// 		if (skip_frames < 0 || skip_frames > last_frame)
// 			return;
// 		frame = object_stack[last_frame - skip_frames];
// 		if (uri === '#')
// 			return frame.key;
// 	} else
// 		frame = object_stack[0];

// 	object = frame.object[frame.key];

// 	if (uri === '')
// 		return object;

// 	if (uri.charAt(0) === '/') {
// 		uri = uri.substr(1);
// 		components = uri.split('/');
// 		while (components.length > 0) {
// 			components[0] = components[0].replace(/~1/g, '/').replace(/~0/g, '~');
// 			if (!object.hasOwnProperty(components[0]))
// 				return;
// 			object = object[components[0]];
// 			components.shift();
// 		}
// 		return object;
// 	} else
// 		return;
// };


// /**
//  *
//  * Check Validity of Archetype Instance
//  *
//  */

// var checkValidity = function(env, schema_stack, object_stack, options) {
// 	var i, len, count, hasProp, hasPattern;
// 	var p, v, malformed = false,
// 		objerrs = {},
// 		objerr, objreq, errors = {},
// 		props, matched, isArray;
// 	var sl = schema_stack.length - 1,
// 		schema = schema_stack[sl];
// 	var ol = object_stack.length - 1,
// 		object = object_stack[ol].object,
// 		name = object_stack[ol].key,
// 		prop = object[name];

// 	if (schema.hasOwnProperty('$ref')) {
// 		schema_stack = resolveURI(env, schema_stack, schema.$ref);
// 		if (!schema_stack)
// 			return {
// 				'$ref': schema.$ref
// 			};
// 		else
// 			return checkValidity(env, schema_stack, object_stack, options);
// 	}

// 	if (schema.hasOwnProperty('type')) {
// 		if (typeof schema.type === 'string') {
// 			if (options.useCoerce && env.coerceType.hasOwnProperty(schema.type))
// 				prop = object[name] = env.coerceType[schema.type](prop);
// 			if (!env.fieldType[schema.type](prop))
// 				return {
// 					'type': schema.type
// 				};
// 		} else {
// 			malformed = true;
// 			for (i = 0, len = schema.type.length; i < len && malformed; i++)
// 				if (env.fieldType[schema.type[i]](prop))
// 					malformed = false;
// 			if (malformed)
// 				return {
// 					'type': schema.type
// 				};
// 		}
// 	}

// 	if (schema.hasOwnProperty('allOf')) {
// 		for (i = 0, len = schema.allOf.length; i < len; i++) {
// 			objerr = checkValidity(env, schema_stack.concat(schema.allOf[i]), object_stack, options);
// 			if (objerr)
// 				return objerr;
// 		}
// 	}

// 	if (!options.useCoerce && !options.useDefault && !options.removeAdditional) {
// 		if (schema.hasOwnProperty('oneOf')) {
// 			for (i = 0, len = schema.oneOf.length, count = 0; i < len; i++) {
// 				objerr = checkValidity(env, schema_stack.concat(schema.oneOf[i]), object_stack, options);
// 				if (!objerr) {
// 					count = count + 1;
// 					if (count > 1)
// 						break;
// 				} else {
// 					objerrs = objerr;
// 				}
// 			}
// 			if (count > 1)
// 				return {
// 					'oneOf': true
// 				};
// 			else if (count < 1)
// 				return objerrs;
// 			objerrs = {};
// 		}

// 		if (schema.hasOwnProperty('anyOf')) {
// 			for (i = 0, len = schema.anyOf.length; i < len; i++) {
// 				objerr = checkValidity(env, schema_stack.concat(schema.anyOf[i]), object_stack, options);
// 				if (!objerr)
// 					break;
// 			}
// 			if (objerr)
// 				return objerr;
// 		}

// 		if (schema.hasOwnProperty('not')) {
// 			objerr = checkValidity(env, schema_stack.concat(schema.not), object_stack, options);
// 			if (!objerr)
// 				return {
// 					'not': true
// 				};
// 		}
// 	} else {
// 		if (schema.hasOwnProperty('oneOf')) {
// 			for (i = 0, len = schema.oneOf.length, count = 0; i < len; i++) {
// 				new_stack = clone_stack(object_stack);
// 				objerr = checkValidity(env, schema_stack.concat(schema.oneOf[i]), new_stack, options);
// 				if (!objerr) {
// 					count = count + 1;
// 					if (count > 1)
// 						break;
// 					else
// 						copy_stack(new_stack, object_stack);
// 				} else {
// 					objerrs = objerr;
// 				}
// 			}
// 			if (count > 1)
// 				return {
// 					'oneOf': true
// 				};
// 			else if (count < 1)
// 				return objerrs;
// 			objerrs = {};
// 		}

// 		if (schema.hasOwnProperty('anyOf')) {
// 			for (i = 0, len = schema.anyOf.length; i < len; i++) {
// 				new_stack = clone_stack(object_stack);
// 				objerr = checkValidity(env, schema_stack.concat(schema.anyOf[i]), new_stack, options);
// 				if (!objerr) {
// 					copy_stack(new_stack, object_stack);
// 					break;
// 				}
// 			}
// 			if (objerr)
// 				return objerr;
// 		}

// 		if (schema.hasOwnProperty('not')) {
// 			objerr = checkValidity(env, schema_stack.concat(schema.not), clone_stack(object_stack), options);
// 			if (!objerr)
// 				return {
// 					'not': true
// 				};
// 		}
// 	}

// 	if (schema.hasOwnProperty('dependencies')) {
// 		for (p in schema.dependencies)
// 			if (schema.dependencies.hasOwnProperty(p) && prop.hasOwnProperty(p)) {
// 				if (Array.isArray(schema.dependencies[p])) {
// 					for (i = 0, len = schema.dependencies[p].length; i < len; i++)
// 						if (!prop.hasOwnProperty(schema.dependencies[p][i])) {
// 							return {
// 								'dependencies': true
// 							};
// 						}
// 				} else {
// 					objerr = checkValidity(env, schema_stack.concat(schema.dependencies[p]), object_stack, options);
// 					if (objerr)
// 						return objerr;
// 				}
// 			}
// 	}

// 	if (!Array.isArray(prop)) {
// 		props = [];
// 		objerrs = {};
// 		for (p in prop)
// 			if (prop.hasOwnProperty(p))
// 				props.push(p);

// 		if (options.checkRequired && schema.required) {
// 			for (i = 0, len = schema.required.length; i < len; i++)
// 				if (!prop.hasOwnProperty(schema.required[i])) {
// 					objerrs[schema.required[i]] = {
// 						'required': true
// 					};
// 					malformed = true;
// 				}
// 		}

// 		hasProp = schema.hasOwnProperty('properties');
// 		hasPattern = schema.hasOwnProperty('patternProperties');
// 		if (hasProp || hasPattern) {
// 			i = props.length;
// 			while (i--) {
// 				matched = false;
// 				if (hasProp && schema.properties.hasOwnProperty(props[i])) {
// 					matched = true;
// 					objerr = checkValidity(env, schema_stack.concat(schema.properties[props[i]]), object_stack.concat({
// 						object: prop,
// 						key: props[i]
// 					}), options);
// 					if (objerr !== null) {
// 						objerrs[props[i]] = objerr;
// 						malformed = true;
// 					}
// 				}
// 				if (hasPattern) {
// 					for (p in schema.patternProperties)
// 						if (schema.patternProperties.hasOwnProperty(p) && props[i].match(p)) {
// 							matched = true;
// 							objerr = checkValidity(env, schema_stack.concat(schema.patternProperties[p]), object_stack.concat({
// 								object: prop,
// 								key: props[i]
// 							}), options);
// 							if (objerr !== null) {
// 								objerrs[props[i]] = objerr;
// 								malformed = true;
// 							}
// 						}
// 				}
// 				if (matched)
// 					props.splice(i, 1);
// 			}
// 		}

// 		if (options.useDefault && hasProp && !malformed) {
// 			for (p in schema.properties)
// 				if (schema.properties.hasOwnProperty(p) && !prop.hasOwnProperty(p) && schema.properties[p].hasOwnProperty('default'))
// 					prop[p] = schema.properties[p]['default'];
// 		}

// 		if (options.removeAdditional && hasProp && schema.additionalProperties !== true && typeof schema.additionalProperties !== 'object') {
// 			for (i = 0, len = props.length; i < len; i++)
// 				delete prop[props[i]];
// 		} else {
// 			if (schema.hasOwnProperty('additionalProperties')) {
// 				if (typeof schema.additionalProperties === 'boolean') {
// 					if (!schema.additionalProperties) {
// 						for (i = 0, len = props.length; i < len; i++) {
// 							objerrs[props[i]] = {
// 								'additional': true
// 							};
// 							malformed = true;
// 						}
// 					}
// 				} else {
// 					for (i = 0, len = props.length; i < len; i++) {
// 						objerr = checkValidity(env, schema_stack.concat(schema.additionalProperties), object_stack.concat({
// 							object: prop,
// 							key: props[i]
// 						}), options);
// 						if (objerr !== null) {
// 							objerrs[props[i]] = objerr;
// 							malformed = true;
// 						}
// 					}
// 				}
// 			}
// 		}
// 		if (malformed)
// 			return {
// 				'schema': objerrs
// 			};
// 	} else {
// 		if (schema.hasOwnProperty('items')) {
// 			if (Array.isArray(schema.items)) {
// 				for (i = 0, len = schema.items.length; i < len; i++) {
// 					objerr = checkValidity(env, schema_stack.concat(schema.items[i]), object_stack.concat({
// 						object: prop,
// 						key: i
// 					}), options);
// 					if (objerr !== null) {
// 						objerrs[i] = objerr;
// 						malformed = true;
// 					}
// 				}
// 				if (prop.length > len && schema.hasOwnProperty('additionalItems')) {
// 					if (typeof schema.additionalItems === 'boolean') {
// 						if (!schema.additionalItems)
// 							return {
// 								'additionalItems': true
// 							};
// 					} else {
// 						for (i = len, len = prop.length; i < len; i++) {
// 							objerr = checkValidity(env, schema_stack.concat(schema.additionalItems), object_stack.concat({
// 								object: prop,
// 								key: i
// 							}), options);
// 							if (objerr !== null) {
// 								objerrs[i] = objerr;
// 								malformed = true;
// 							}
// 						}
// 					}
// 				}
// 			} else {
// 				for (i = 0, len = prop.length; i < len; i++) {
// 					objerr = checkValidity(env, schema_stack.concat(schema.items), object_stack.concat({
// 						object: prop,
// 						key: i
// 					}), options);
// 					if (objerr !== null) {
// 						objerrs[i] = objerr;
// 						malformed = true;
// 					}
// 				}
// 			}
// 		} else if (schema.hasOwnProperty('additionalItems')) {
// 			if (typeof schema.additionalItems !== 'boolean') {
// 				for (i = 0, len = prop.length; i < len; i++) {
// 					objerr = checkValidity(env, schema_stack.concat(schema.additionalItems), object_stack.concat({
// 						object: prop,
// 						key: i
// 					}), options);
// 					if (objerr !== null) {
// 						objerrs[i] = objerr;
// 						malformed = true;
// 					}
// 				}
// 			}
// 		}
// 		if (malformed)
// 			return {
// 				'schema': objerrs
// 			};
// 	}

// 	for (v in schema) {
// 		if (schema.hasOwnProperty(v) && !handled.hasOwnProperty(v)) {
// 			if (v === 'format') {
// 				if (env.fieldFormat.hasOwnProperty(schema[v]) && !env.fieldFormat[schema[v]](prop, schema, object_stack, options)) {
// 					objerrs[v] = true;
// 					malformed = true;
// 				}
// 			} else {
// 				if (env.fieldValidate.hasOwnProperty(v) && !env.fieldValidate[v](prop, schema[v].hasOwnProperty('$data') ? resolveObjectRef(object_stack, schema[v].$data) : schema[v], schema, object_stack, options)) {
// 					objerrs[v] = true;
// 					malformed = true;
// 				}
// 			}
// 		}
// 	}

// 	if (malformed)
// 		return objerrs;
// 	else
// 		return null;
// };

// /**
//  * Error Messages
//  */

// var defaultOptions = {
// 	useDefault: false,
// 	useCoerce: false,
// 	checkRequired: true,
// 	removeAdditional: false
// };

// function Servant() {
// 	if (!(this instanceof Servant))
// 		return new Servant();

// 	this.coerceType = {};
// 	this.fieldType = clone(fieldType);
// 	this.fieldValidate = clone(fieldValidate);
// 	this.fieldFormat = clone(fieldFormat);
// 	this.defaultOptions = clone(defaultOptions);
// 	this.errorMessages = errorMessages;
// 	// Add Schemas
// 	this.schema = jsonarchetypes;
// 	console.log("KJSSUFOSJFS", this.schema)

// };

// /**
//  *  User-friendly Error Messages
//  */

// var errorMessages = {
// 	default: 'Sorry, something went wrong',
// 	required: ' is required',
// 	type: ' must be a ',
// 	maxLength: ' is too long.  The character limit is ',
// 	enum: ' is not a valid option',
// 	format: ' is not a valid ',
// 	minItems: ' needs more items.  Please enter a minimum of ',
// 	maxItems: ' has too many items.  Please enter a maximum of ',
// 	uniqueItems: ' has duplicate items.  Please remove any duplicates',
// 	minimum: ' has a minimum of ',
// 	maximum: ' has a maximum of '
// };

// module.exports = function(name, object) {

// 	var schema_stack = [name],
// 		errors = null,
// 		object_stack = [{
// 			object: {
// 				'__root__': object
// 			},
// 			key: '__root__'
// 		}];

// 	if (typeof name === 'string') {
// 		schema_stack = resolveURI(this, null, name);
// 		if (!schema_stack)
// 			throw new Error('jjv: could not find schema \'' + name + '\'.');
// 	}

// 	options = this.defaultOptions;

// 	errors = checkValidity(this, schema_stack, object_stack, options);

// 	if (errors) {

// 		var thisSchema = this.schema[name].properties;

// 		errors = errors.hasOwnProperty('schema') ? errors.schema : errors;

// 		var temp_property = null;

// 		// Loop Through Error Object Properties and add error messages
// 		for (var property in errors) {
// 			if (errors.hasOwnProperty(property)) {
// 				// Required
// 				if (typeof errors[property].required !== 'undefined') {
// 					temp_property = property.replace(/_/g, ' ');
// 					errors[property].message = temp_property + this.errorMessages.required;
// 				} else if (typeof errors[property].type !== 'undefined') {
// 					// Type
// 					temp_property = property.replace(/_/g, ' ');
// 					errors[property].message = temp_property + this.errorMessages.type + thisSchema[property].type;
// 				} else if (typeof errors[property].maxLength !== 'undefined') {
// 					// MaxLength
// 					temp_property = property.replace(/_/g, ' ');
// 					errors[property].message = temp_property + this.errorMessages.maxLength + thisSchema[property].maxLength;
// 				} else if (typeof errors[property].format !== 'undefined') {
// 					// Format
// 					temp_property = property.replace(/_/g, ' ');
// 					errors[property].message = object[property] + ' is not a valid ' + thisSchema[property].format;
// 				} else if (typeof errors[property].enum !== 'undefined') {
// 					// Enum
// 					errors[property].message = object[property] + this.errorMessages.enum;
// 				} else if (typeof errors[property].minItems !== 'undefined') {
// 					// Array minItems
// 					temp_property = property.replace(/_/g, ' ');
// 					errors[property].message = temp_property + this.errorMessages.minItems + thisSchema[property].minItems;
// 				} else if (typeof errors[property].maxItems !== 'undefined') {
// 					// Array maxItems
// 					temp_property = property.replace(/_/g, ' ');
// 					errors[property].message = temp_property + this.errorMessages.maxItems + thisSchema[property].maxItems;
// 				} else if (typeof errors[property].uniqueItems !== 'undefined') {
// 					// Array uniqueItems
// 					temp_property = property.replace(/_/g, ' ');
// 					errors[property].message = temp_property + this.errorMessages.uniqueItems;
// 				} else if (typeof errors[property].minimum !== 'undefined') {
// 					// Number Minimum & Exclusive Minimum
// 					temp_property = property.replace(/_/g, ' ');
// 					errors[property].message = temp_property + this.errorMessages.minimum + thisSchema[property].minimum;
// 				} else if (typeof errors[property].maximum !== 'undefined') {
// 					// Number Maximum & Exclusive Maximum
// 					temp_property = property.replace(/_/g, ' ');
// 					errors[property].message = temp_property + this.errorMessages.maximum + thisSchema[property].maximum;
// 				} else {
// 					errors[property].message = this.errorMessages.default;
// 				}
// 				// Capitalize First Letter of Error Message
// 				errors[property].message = errors[property].message.charAt(0).toUpperCase() + errors[property].message.slice(1);
// 			}
// 		}

// 		// TODO - Go through each key in the schema and add on user-friendly error messages use the property 'message' for each.
// 		return errors.hasOwnProperty('schema') ? errors.schema : errors

// 	} else {
// 		return null;
// 	}
// };