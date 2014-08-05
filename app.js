var express = require('express');
var morgan = require('morgan');

var app = express();

// Always runs
app.use(morgan('dev'));

// If the path matches a file path starting from /public, then it will
// be served by this middleware, and the request will stop traveling the pipeline.
// Try localhost:3000/about.html  then try localhost:3000/about
app.use(express.static(__dirname + '/public'));

// Only runs for http://localhost:3000/
app.get('/', function(req, res) {
	res.send("<h1>Hello World</h1>");
});

// Only runs for http://localhost:3000/about
app.get('/about', function(req, res) {
	res.send("<h2>About</h2><p>This is the about page</p>");
});

// Only runs for http://localhost:3000/discover
app.get('/discover', function(req, res, next) {
	res.send("<h2>Discover</h2><p>This is the discover page</p>");
});

// This also runs for http://localhost:3000/discover
app.get('/discover', function(req, res) {
	console.log('Someone went to the discover page!');
});

app.listen(3000);
console.log('App listening to http://localhost:3000');