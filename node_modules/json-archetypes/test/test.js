var ZSchema = require("z-schema");
var validator = new ZSchema();
var test = require('tape');
var JATs = require('../index');


/**
 * Test Audio Book Archetype
 */
test('****** Test Audio Book Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.audio_book, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Audio Lecture Archetype
 */
test('****** Test Audio Lecture Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.audio_lecture, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Blog Post Archetype
 */
test('****** Test Blog Post Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.blog_post, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Event Archetype
 */
test('****** Test Event Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.event, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Image Archetype
 */
test('****** Test Image Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.image, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Job Listing Archetype
 */
test('****** Test Job Listing Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.job_listing, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Note Archetype
 */
test('****** Test Note Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.note, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Contact Archetype
 */
test('****** Test Contact Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.contact, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Place Archetype
 */
test('****** Test Place Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.place, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Product Archetype
 */
test('****** Test Product Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.product, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Real Estate Listing Archetype
 */
test('****** Test Real Estate Listing Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.real_estate_listing, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Receipt Archetype
 */
test('****** Test Receipt Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.receipt, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Review Archetype
 */
test('****** Test Review Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.review, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Song Archetype
 */
test('****** Test Song Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.song, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Special Deal Archetype
 */
test('****** Test Special Deal Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.special_deal, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Task Archetype
 */
test('****** Test Task Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.task, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});

/**
 * Test Tiny Text  Archetype
 */
test('****** Test TinyText Archetype Schema', function(t) {
    validator.validateSchema(JATs.archetypes.tinytext, function(err, report) {
        console.log(err, report)
        t.equal(report.valid, true, 'Schema is valid per JSON Schema v4');
        t.end();
    });
});


























// end