/**
 * Validate JSON Archetype Instances
 */


// Dependencies
var JATs = require('json-archetypes');



/**
 * Utilities
 */

var _utilities = {};

_utilities.whatIs = function(what) {

    var to = typeof what;

    if (to === 'object') {
        if (what === null) {
            return 'null';
        }
        if (Array.isArray(what)) {
            return 'array';
        }
        return 'object'; // typeof what === 'object' && what === Object(what) && !Array.isArray(what);
    }

    if (to === 'number') {
        if (Number.isFinite(what)) {
            if (what % 1 === 0) {
                return 'integer';
            } else {
                return 'number';
            }
        }
        if (Number.isNaN(what)) {
            return 'not-a-number';
        }
        return 'unknown-number';
    }

    return to; // undefined, boolean, string, function

};

_utilities.areEqual = function(json1, json2) {
    if (json1 === json2) {
        return true;
    }

    var i, len;

    // If both are arrays
    if (Array.isArray(json1) && Array.isArray(json2)) {
        // have the same number of items; and
        if (json1.length !== json2.length) {
            return false;
        }
        // items at the same index are equal according to this definition; or
        len = json1.length;
        for (i = 0; i < len; i++) {
            if (!_utilities.areEqual(json1[i], json2[i])) {
                return false;
            }
        }
        return true;
    }

    // If both are objects
    if (_utilities.whatIs(json1) === 'object' && _utilities.whatIs(json2) === 'object') {
        // have the same set of property names; and
        var keys1 = Object.keys(json1);
        var keys2 = Object.keys(json2);
        if (!_utilities.areEqual(keys1, keys2)) {
            return false;
        }
        // values for a same property name are equal according to this definition.
        len = keys1.length;
        for (i = 0; i < len; i++) {
            if (!_utilities.areEqual(json1[keys1[i]], json2[keys1[i]])) {
                return false;
            }
        }
        return true;
    }

    return false;
};

_utilities.isUniqueArray = function(arr, indexes) {
    var i, j, l = arr.length;
    for (i = 0; i < l; i++) {
        for (j = i + 1; j < l; j++) {
            if (_utilities.areEqual(arr[i], arr[j])) {
                if (indexes) {
                    indexes.push(i, j);
                }
                return false;
            }
        }
    }
    return true;
};

_utilities.formatValidators = {
    "date": function(date) {
        if (typeof date !== "string") {
            return true;
        }
        // full-date from http://tools.ietf.org/html/rfc3339#section-5.6
        var matches = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(date);
        if (matches === null) {
            return false;
        }
        // var year = matches[1];
        // var month = matches[2];
        // var day = matches[3];
        if (matches[2] < "01" || matches[2] > "12" || matches[3] < "01" || matches[3] > "31") {
            return false;
        }
        return true;
    },
    "date-time": function(dateTime) {
        if (typeof dateTime !== "string") {
            return true;
        }
        // date-time from http://tools.ietf.org/html/rfc3339#section-5.6
        var s = dateTime.toLowerCase().split("t");
        if (!_utilities.formatValidators.date(s[0])) {
            return false;
        }
        var matches = /^([0-9]{2}):([0-9]{2}):([0-9]{2})(.[0-9]+)?(z|([+-][0-9]{2}:[0-9]{2}))$/.exec(s[1]);
        if (matches === null) {
            return false;
        }
        // var hour = matches[1];
        // var minute = matches[2];
        // var second = matches[3];
        // var fraction = matches[4];
        // var timezone = matches[5];
        if (matches[1] > "23" || matches[2] > "59" || matches[3] > "59") {
            return false;
        }
        return true;
    },
    "email": function(email) {
        if (typeof email !== "string") {
            return true;
        }
        // use regex from owasp: https://www.owasp.org/index.php/OWASP_Validation_Regex_Repository
        return /^[a-zA-Z0-9+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/.test(email);
    },
    "regex": function(str) {
        try {
            RegExp(str);
            return true;
        } catch (e) {
            return false;
        }
    },
    "uri": function(uri) {
        // RegExp from http://tools.ietf.org/html/rfc3986#appendix-B
        return typeof uri !== "string" || RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?").test(uri);
    }
}; // _utilities.formatValidators



/**
 * Validator
 */

_validators = {
    maximum: function(rules, value) {
        if (rules.exclusiveMaximum !== true) {
            if (value > rules.maximum) return 'Must be less than ' + rules.maximum;
        } else {
            if (value >= rules.maximum) return 'Must be less than ' + rules.maximum;
        }
    },
    minimum: function(rules, value) {
        if (rules.exclusiveMinimum !== true) {
            if (value < rules.minimum) return 'Must be more than ' + rules.minimum;
        } else {
            if (value <= rules.minimum) return 'Must be more than ' + rules.minimum;
        }
    },
    maxLength: function(rules, value) {
        if (value.length > rules.maxLength) return 'Must be less than ' + rules.maxLength + ' characters';
    },
    minLength: function(rules, value) {
        if (json.length < schema.minLength) return 'Must be at least ' + rules.minLength + ' characters or more';
    },
    pattern: function(rules, value) {
        if (RegExp(rules.pattern).test(value) === false) {
            // TODO - Add Error
        }
    },
    maxItems: function(rules, array) {
        if (!Array.isArray(array))
            return;
        if (array.length > rules.maxItems) return 'Only ' + rules.maxItems + ' or less allowed';
    },
    minItems: function(rules, array) {
        if (!Array.isArray(array)) return;
        if (array.length < rules.minItems) return 'Only ' + rules.minItems + ' or more allowed';
    },
    uniqueItems: function(rules, array) {
        if (!Array.isArray(array))
            return;
        if (rules.uniqueItems === true) {
            if (_utilities.isUniqueArray(array, []) === false) return 'No duplicates allowed';
        }
    },
    enum: function(rules, value) {
        var match = false,
            idx = rules.enum.length;
        while (idx--) {
            if (_utilities.areEqual(value, rules.enum[idx])) {
                match = true;
                break;
            }
        }
        if (match === false) return value + ' is not an allowed option';
    },
    format: function(rules, value) {
        if (!_utilities.formatValidators[rules.format](value))
            return 'Not a valid ' + rules.format + ' format';

    },
    required: function(requiredArray, object) {
        var errors = {};
        for (var i = 0, len = requiredArray.length; i < len; i++) {
            if (!object[requiredArray[i]] || object[requiredArray[i]] === '') {
                errors[requiredArray[i]] = requiredArray[i] + ' is required';
            }
        }
        if (Object.keys(errors).length) return errors;
    }
};

_validateProperty = function(errors, rules, value, property) {
    // now iterate all the rules in schema property and execute validation methods
    var keys = Object.keys(rules);
    var idx = keys.length;
    while (idx--) {
        if (_validators[keys[idx]]) {
            var error = _validators[keys[idx]](rules, value, property);
            if (error) return error;
        }
    };
};

_validateNestedArchetype = function(errors, rules, value) {
    if (_utilities.whatIs(value) === 'object') {
        if (!value._id || typeof value._id === 'undefined') return 'Nested Archetypes must be published on Servant first.  Please publish this nested Archetype on Servant, then include the publshed object';
    } else if (_utilities.whatIs(value) !== 'string') {
        return 'Nested Archetypes must either be an ID string or an object that has already been published on Servant and has an "_id" property.';
    }
    return null;
};

_validateArray = function(errors, rules, array, property) {
    // Function to create array errors
    var createArrayError = function(errors, arrayproperty, objectproperty, index, err) {
        if (!errors[arrayproperty]) errors[arrayproperty] = {};
        if (!objectproperty) return errors[arrayproperty][index] = err;
        if (!errors[arrayproperty][index]) errors[arrayproperty][index] = {};
        return errors[arrayproperty][index][objectproperty] = err;
    };
    // Validate Array Root Schema
    var keys = Object.keys(rules);
    var idx = keys.length;
    while (idx--) {
        if (_validators[keys[idx]]) {
            var error = _validators[keys[idx]](rules, array);
            if (error) errors[property] = error;
        }
    };

    // Iterate Through Array
    array.forEach(function(item, i) { // TODO - Get rid of this forEach, it's slow

        if (rules.items.$ref) {
            // Check if nested Archetype
            var error = _validateNestedArchetype(errors, rules.items, item);
            if (error) createArrayError(errors, property, null, i, error);
        } else if (rules.items.type && rules.items.type !== 'object') {
            // If the items is not an object
            // Check its type
            if (_utilities.whatIs(item) !== rules.items.type) {
                createArrayError(errors, property, null, i, 'Invalid type');
            } else {
                var error = _validateProperty(errors, rules.items, item, property);
                if (error) createArrayError(errors, property, null, i, error);
            }
        } else if (rules.items.type && rules.items.type === 'object') {
            // Check type of item first
            if (_utilities.whatIs(item) !== 'object') {
                createArrayError(errors, property, null, i, 'Invalid type.  Must be an object');
            } else {
                // Check Required Fields
                var error = _validators.required(rules.items.required, item);
                if (error) {
                    for (prop in error) {
                        createArrayError(errors, property, prop, i, error[prop]);
                    }
                } else {
                    // If Required Fields Are Present, Iterate Through Properties
                    var keys2 = Object.keys(item);
                    var idx2 = keys2.length;
                    while (idx2--) {
                        // Check if property is allowed
                        if (!rules.items.properties[keys2[idx2]]) {
                            createArrayError(errors, property, keys2[idx2], i, 'This property is not allowed');
                        } else {
                            // Validate Properties
                            var keys3 = Object.keys(rules.items.properties[keys2[idx2]]);
                            var idx3 = keys3.length;
                            // Check Type
                            if (rules.items.properties[keys2[idx2]].type && _utilities.whatIs(item[keys2[idx2]]) !== rules.items.properties[keys2[idx2]].type) {
                                createArrayError(errors, property, keys2[idx2], i, 'Invalid Type');
                            } else {
                                // Other Validations
                                while (idx3--) {
                                    if (_validators[keys3[idx3]]) {
                                        var error = _validators[keys3[idx3]](rules.items.properties[keys2[idx2]], item[keys2[idx2]]);
                                        if (error && (!errors[property] || !errors[property][i] || !errors[property][i][keys2[idx2]])) createArrayError(errors, property, keys2[idx2], i, error);
                                    }
                                };
                            }
                        }
                    };
                }
            }
        }
    });
};



/**
 * Validate Instances of Archetypes
 */

module.exports.validate = function(ServantDefaults, archetype, instance, callback) {

    // Prepare Archetype
    if (typeof archetype !== 'string') {
        throw new Error('Archetype parameter must be a string');
    } else if (!JATs.archetypes[archetype]) {
        throw new Error('The archetype you entered does not exist: ' + archetype);
    } else {
        archetype = JATs.archetypes[archetype];
    }

    var errors = {};

    // Check Instance
    if (!instance || _utilities.whatIs(instance) !== 'object') {
        errors.schema = 'You did not submit a valid object to validate';
        return callback(errors, null);
    }

    // Check Required Fields, if they exist
    if (archetype.required && archetype.required.length) {
        var required = _validators.required(archetype.required, instance);
        if (required) {
            for (prop in required) {
                errors[prop] = required[prop];
            }
        }
    }

    // Validate Object Root Properties
    var keys1 = Object.keys(instance);
    var idx1 = keys1.length;
    while (idx1--) {

        if (!archetype.properties[keys1[idx1]]) {
            // Check If Allowed Property
            errors[keys1[idx1]] = keys1[idx1] + ' is not allowed';
        } else if (archetype.properties[keys1[idx1]] && archetype.properties[keys1[idx1]].type && _utilities.whatIs(instance[keys1[idx1]]) !== archetype.properties[keys1[idx1]].type) {
            // Check If Valid Type
            errors[keys1[idx1]] = 'Invalid type';
        } else if (archetype.properties[keys1[idx1]] && _utilities.whatIs(instance[keys1[idx1]]) === 'array' && instance[keys1[idx1]].length) {
            // Check If Array
            _validateArray(errors, archetype.properties[keys1[idx1]], instance[keys1[idx1]], keys1[idx1]);
        } else if (archetype.properties[keys1[idx1]] && archetype.properties[keys1[idx1]].$ref) {
            // Check If Nested Archetype
            var error = _validateNestedArchetype(errors, archetype.properties[keys1[idx1]], instance[keys1[idx1]]);
            if (error) errors[keys1[idx1]] = error;
        } else {
            // Check If A Regular Property, Then Validate
            var error = _validateProperty(errors, archetype.properties[keys1[idx1]], instance[keys1[idx1]], keys1[idx1]);
            if (error) errors[keys1[idx1]] = error;
        }
    }

    // Callback Errors
    if (Object.keys(errors).length) return callback({
        error: "Validation Failed",
        errors: errors
    }, null);
    // Callback Valid
    return callback(null, instance);

}; // validate



/**
 * Instantiate Instances of Archetypes
 */

module.exports.instantiate = function(archetype) {
    if (typeof archetype !== 'string') throw new Error('The new() method only accept a string for a name parameter');
    archetype = archetype.toLowerCase();
    if (!JATs.archetypes[archetype]) throw new Error('JSON Archetype does not exist: ' + archetype);
    if (archetype === 'image') throw new Error("Image Archetype cannot be instantiated.  To create an Image Archetype, simply upload an image to Servant.");

    var instance = {};
    for (property in JATs.archetypes[archetype].properties) {

        // Handle Depending On Type & Format
        if (JATs.archetypes[archetype].properties[property].type !== 'array' && JATs.archetypes[archetype].properties[property].type !== 'object' && JATs.archetypes[archetype].properties[property] !== '_id') {

            // Check Format
            if (!JATs.archetypes[archetype].properties[property].format) {
                instance[property] = JATs.archetypes[archetype].properties[property].default;
            } else if (JATs.archetypes[archetype].properties[property].format === 'date' || JATs.archetypes[archetype].properties[property].format === 'date-time') {
                // If Date or Date-time Format
                var d = new Date();
                instance[property] = d.toISOString();
            }

        } else {
            // Handle Arrays & Objects
            instance[property] = JATs.archetypes[archetype].properties[property].default.slice();
        }
    }; // for

    // Remove _id attribute since it is new
    delete instance._id;

    // Return Instance
    return instance;
}; // instantiate



// End