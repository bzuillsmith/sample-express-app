var express = require('express');
var path = require('path');
var log = require('./lib/logger');
var settings = require('./lib/settings');

// Middleware
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');

module.exports = function(db) {

	var app = express();

	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');

	app.locals.appName = "ZS Express";

	// Serves the icon you see in the tab of your browser
	app.use(favicon(path.resolve(__dirname + '/../frontend/static/images/favicon.ico')));
	// Logs any request that is not a favicon request
	app.use(morgan('dev'));
	// Compresses responses so they are smaller
	app.use(compression());
	// Enables reading JSON-formatted data from a request
	app.use(bodyParser.json({ strict: false }));
	// Enables reading standard form data from a request
	app.use(bodyParser.urlencoded({extended: false}));
	// Enables PUT and DELETE requests
	app.use(methodOverride());
	// If a request includes cookies, this parses them and makes them available to read/modify
	app.use(cookieParser());
	// This sets a cookie that represents an in-memory session
	app.use(session({
		resave: false,
		saveUninitialized: false,
		secret: 'HuV7LCNDXKhYAwv00LACWxvKRHrk7hWKEZNaiUuH'
	}));

	// TODO: MongoStore for persistent sessions
	// TODO: Passport for authentication

	// If the path matches a file path starting from (but excluding) /frontend/static, then it will
	// be served by this middleware, and the request will stop traveling the pipeline.
	// Try localhost:3000/about.html
	app.use(express.static(path.join(__dirname, '..', 'frontend', 'static')));


	app.use(require('./routes')(db));


	// Custom 404 Not Found middleware
	app.use(function (req, res) {
		// If the request prefers a json response, send json error object
		if (req.accepts(['html', 'json']) === 'json') {
			return res.send(404, { error: '404 Not Found'});
		}
		// If json is not preferred, send a full html error page
		res.status(404).render('error/404', { title: 'Page Not Found'});
	});


	// Custom Error Handling Middleware
	// Always expects an Error object with `stack` and `message` properties.
	// Optionally, the error may have a `status` property that will set the status of the response.
	app.use(function (err, req, res, next) {
		if (err.status) res.statusCode = err.status;
		if (res.statusCode === 200) res.statusCode = 500;

		if (!err.stack || !err.message) {
			log.error('Invalid error object passed to error handler:', err);
			err = { message: 'Oops, we had an unexpected error. Looks like we messed up.'};
			res.statusCode = 500;
		} else {
			log.error(err.stack);

			// This shouldn't happen, but just in case
			if (res.statusCode < 400) {
				log.error('Odd statusCode `' + res.statusCode +
					'` reached error handler for path `' + req.originalUrl + '`.');
				res.statusCode = 500;
			}
		}

		// If in production, strip everything but the message
		if ('production' === settings.env) err = { message: err.message };

		// If the request prefers json, then send a json response.
		if (req.accepts(['html', 'json']) === 'json') return res.send(err);

		// If we get here, send an html error page
		res.render('error/500', {error: err, title: "Server Error"});
	});

	return app;
};