var ObjectID = require('mongodb').ObjectID;
var ZSchema = require('z-schema');
var util = require('util');
var log = require('../logger');
var ValidationError = require('../errors').ValidationError;

module.exports = NoteService;

/**
 * Our NoteService class
 * @param db
 * @constructor
 */
function NoteService(db) {
	if(!db) throw new TypeError('Invalid db passed to NoteService `' + db + '`');

	this.collection = db.collection('notes');
}


/**
 * Find a note by id. Id can be a string or ObjectID.
 * @param  {string, ObjectID}   id   the ObjectId or the string representation of the ObjectId
 * @param  {Function} done callback(err, note)
 */
NoteService.prototype.findById = function(id, done) {
	if(typeof id === 'string') {
		try{
			id = ObjectID(id);
		}catch(err) {
			return done(err);
		}
	}

	this.collection.findOne({_id: id}, { password: 0 }, done);
};

/**
 * Gets a list of notes with a set of reasonable defaults.
 * @param query
 * @param options
 * @param {Function} done
 */
NoteService.prototype.list = function(query, options, done) {
	if(typeof options === 'function') {
		done = options;
		options = {};
	}

	var defaults = {
		fields : {
			createdBy: 1,
			lastModified: 1,
			note: 1
		},
		limit: 100,
		skip: 0
	};

	options.fields = options.fields || defaults.fields;
	options.sort = options.sort || defaults.sort;
	options.limit = options.limit || defaults.limit;
	options.skip = options.skip || defaults.skip;

	this.collection.find(query, options).toArray(done);
};

var addNoteSchema = {
	type: 'object',
	properties: {
		note: {type: 'string', minLength: 1, maxLength: 2048},
		createdBy: { type: 'string', minLength: 2, maxLength: 50 }
	},
	additionalProperties: false,
	required: ['note', 'createdBy']
};

/**
 * Adds a note to the db
 */
NoteService.prototype.add = function(note, done) {

	var self = this;
	ZSchema.validate(note, addNoteSchema, function(err) {
		if(err) return done(new ValidationError(err.errors));

		// coming soon, $currentDate
		var dbNote = { 'note': note.note, 'lastModified': new Date(), 'createdBy': note.createdBy };

		self.collection.insert(dbNote, function(err, result) {
			if(err) return done(err);
			if(result === 0) return done(null, null);
			return done(null, dbNote);
		});
	});

};

/**
 * Removes a note by id. The id can be a string or ObjectID
 * @param {string, ObjectID} id
 * @param {Function} done
 */
NoteService.prototype.remove = function(id, done) {
	var self = this;

	if(typeof id === 'string') {
		try{
			id = ObjectID(id);
		}catch(err) {
			return done(err);
		}
	}

	self.collection.findOne({ _id: id }, function(err, note) {
		if(err) return done(err);
		if(!note) return done(new Error('Note not found. Cannot remove note.'));

		log.info('Deleting note `' + id + '` from notes collection:');
		log.info(util.inspect(note, {depth: null}));

		self.collection.remove({ _id: id }, function(err, result) {
			if(err) return done(err);
			if(result !== 1) return done(new Error('Note not found. Cannot remove note.'));

			log.info('Note `' + id + '` deleted from notes collection');
			done(null, result);
		});
	});
};