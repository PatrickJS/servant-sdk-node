/**
 * Instantiate Data Archetypes
 */

module.exports = function(name) {
	var name = name.toLowerCase();
	if (typeof name !== 'string') throw new Error('Servant SDK Error - The newArchetype() method only accept a string for a name parameter');
	if (jsonarchetypes[name] === 'undefined') throw new Error('Servant SDK Error - You have entered a JSON Archetype that does not exist: ' + name);
	var instance = {};
	for (property in jsonarchetypes[name].properties) {
		instance[property] = jsonarchetypes[name].properties[property].default;
	}
	return instance;
};
