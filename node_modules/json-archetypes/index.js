/**
 *  JSON Archetypes – JSON standards for common types of data
 */


// Collect Archetypes
var archetypes = {};

archetypes.audio_book = require('./archetypes/audio_book/audio_book_archetype_schema');
archetypes.audio_lecture = require('./archetypes/audio_lecture/audio_lecture_archetype_schema');
archetypes.blog_post = require('./archetypes/blog_post/blog_post_archetype_schema');
archetypes.event = require('./archetypes/event/event_archetype_schema');
archetypes.image = require('./archetypes/image/image_archetype_schema');
archetypes.job_listing = require('./archetypes/job_listing/job_listing_archetype_schema');
archetypes.note = require('./archetypes/note/note_archetype_schema');
archetypes.contact = require('./archetypes/contact/contact_archetype_schema');
archetypes.place = require('./archetypes/place/place_archetype_schema');
archetypes.product = require('./archetypes/product/product_archetype_schema');
archetypes.real_estate_listing = require('./archetypes/real_estate_listing/real_estate_listing_archetype_schema');
archetypes.receipt = require('./archetypes/receipt/receipt_archetype_schema');
archetypes.review = require('./archetypes/review/review_archetype_schema');
archetypes.song = require('./archetypes/song/song_archetype_schema');
archetypes.special_deal = require('./archetypes/special_deal/special_deal_archetype_schema');
archetypes.task = require('./archetypes/task/task_archetype_schema');
archetypes.tinytext = require('./archetypes/tinytext/tinytext_archetype_schema');

// Export
module.exports.archetypes = archetypes;
