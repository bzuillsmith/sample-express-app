var joi = require('joi');
var _ = require('lodash');

module.exports = function(router, db) {

	// This is our "class" that accesses/modifies notes in the db
	var NoteService = require('../lib/db-notes')
	var noteService = new NoteService(db);

	// Joi is a wonderful library that takes strings and converts them into the proper
	//  type while validating them. Anyone who works with query strings knows this is
	//  usually a painfully dull process, and this makes that 10x easier.
	var querySchema = joi.object().keys({
		limit: joi.number().integer().min(1).max(1000),
		skip: joi.number().integer().min(0),
		field: joi.string().valid(["createdBy", "note", "lastModified"]),
		value: joi.string().trim(),
		sort: joi.valid(["createdBy", "note"]),
		order: joi.number().valid([1, -1])
	}).and(['sort', 'order']).and('field','value');

	// Read list
	router.get('/api/notes', function(req, res, next) {

		joi.validate(req.query, querySchema, function(err, queryString) {
			var query = {}, options = {};
			if(err) return next(err);

			if(_.isEmpty(queryString)) {
				options.sort = { 'lastModified': -1 };
				query = {};
			} else {
				query = setQuery(queryString.field, queryString.value);
				if(queryString.sort) options.sort[queryString.sort] = queryString.order;
				options.limit = queryString.limit;
				options.skip = queryString.skip;
			}

			noteService.list(query, options, function(err, users) {
				if(err) return next(err);
				res.send(users);
			});
		});

	});

	/**
	 * Adds a note. The lastModified date is handled automatically.
	 */
	router.post('/api/notes', function(req, res, next) {
		var note;

		note = {
			createdBy: req.body.name,
			note: req.body.note
		};

		noteService.add(note, function(err, result) {
			if(err) {
				if(err.message ==='Validation failed') {
					return res.send(400, err);
				}
				return next(err);
			}

			if(result === null) {
				return res.send(400, { error: { message: 'Note does not exist' }});
			}

			// Doesn't belong in the api really, but for quickly getting this working:
			if(req.accepts(['html', 'json']) === 'html') return res.redirect('/notes');

			res.send(200, result);
		});
	});

	/**
	 * Updates a note.
	 * TODO: Not yet used and tested
	 */
	router.put('/api/notes/:id', function(req, res, next) {
		var id;
		try{
			id = ObjectID(req.params.id);
		}catch(err) {
			return res.send(400, {error: err.message});
		}

		noteService.updateNote(id, req.body, function(err, result) {
			if(err) return next(err);

			if(result === 0) {
				return res.send(400, { error: 'Note `' + req.params.id + '` does not exist' });
			}

			res.json(200, null);
		});
	});

	/**
	 * Deletes a note from the db
	 */
	router.delete('/api/notes/:id', function(req, res, next) {
		noteService.remove(req.params.id, function(err, result) {
			if(err) return next(err);

			if(result === 0) {
				return res.send(400, { error: 'Note `' + req.params.id + '` does not exist' });
			}

			res.json(200, null);
		});
	});

};