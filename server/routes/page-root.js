module.exports = function(router, db) {

	router.get('/', function(req, res) {
		res.locals.title = "Home";
		res.render('root');
	});

};