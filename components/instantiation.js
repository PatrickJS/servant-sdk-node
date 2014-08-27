/**
 * Instantiate Data Archetypes
 */

var jsonarchetypes = require('json-archetypes');

module.exports = function(archetype) {
	if (typeof archetype !== 'string') throw new Error('The new() method only accept a string for a name parameter');
	var archetype = archetype.toLowerCase();
	if (!this._archetypes[archetype]) throw new Error('This JSON Archetype has not been registered: ' + archetype + '. Make sure you add it using the addArchetype method');

	var instance = {};
	for (property in this._archetypes[archetype].properties) {
		if (this._archetypes[archetype].properties[property].type !== 'array' && this._archetypes[archetype].properties[property].type !== 'object')
			instance[property] = this._archetypes[archetype].properties[property].default;
		else
			instance[property] = this._archetypes[archetype].properties[property].default.slice();
	}
	return instance;
};