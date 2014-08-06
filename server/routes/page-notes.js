var NoteService = require('../lib/db-notes');

module.exports = function(router, db) {

	var noteService = new NoteService(db);

	router.get('/notes', function(req, res, next) {

		noteService.list({}, function(err, notes) {
			if(err) return next(err);

			res.locals.title = "Notes";
			res.locals.notes = notes;
			res.render('notes');
		});

	});

};