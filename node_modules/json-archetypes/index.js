/**
 *  JSON Archetypes – JSON standards for common types of data
 */


/**
 * Add Archetypes
 */
var archetypes = {};

archetypes.tinytext = require('./archetypes/tiny_text/tiny_text_archetype_schema');
archetypes.image = require('./archetypes/image/image_archetype_schema');
archetypes.person = require('./archetypes/person/person_archetype_schema');
archetypes.product = require('./archetypes/product/product_archetype_schema');

module.exports.archetypes = archetypes;
