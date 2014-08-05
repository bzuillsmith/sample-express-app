module.exports = function(router, db) {

	router.get('/about', function(req, res) {
		// res.locals and app.locals is available in views
		res.locals.title = "About";
		res.render('about');

		// another way of writing the above is
		// res.render('about', { title: "About" });
	});

};