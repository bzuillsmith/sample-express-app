var MongoClient = require('mongodb').MongoClient;
var log = require('./lib/logger').app;
var settings = require('./lib/settings');
var http = require('http');


/**
 * Opens a MongoDB connection. If this fails, the app exits. The connection
 * string is defined in the settings module.
 */
function start() {

	MongoClient.connect(settings.MONGO_CONNECTION_STRING, function (err, database) {
		if (err) {
			log.error(err, 'Couldn\'t connect to MongoDB. Did you start it?\n' +
				'Try running `mongod` in another terminal window.');
			log.error('Killing server process');
			// Give time for output
			setTimeout(function() {
				process.exit(1);
			}, 300);

		} else {
			log.info('Connected to database at: %s', settings.MONGO_CONNECTION_STRING);
			startExpress(database);

		}
	});

}

/**
 * Starts the express server, passing it the open db connection
 * @param db
 */
function startExpress(db) {

	var app = require('./app')(db);
	var server = http.createServer(app);

	server.listen(settings.port, function() {
		app.set('port', server.address().port);
		log.info('App server listening on port ' + app.get('port') + ' in `' + settings.env + '` mode.');
	});
}

start();


