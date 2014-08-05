var express = require('express');

var app = express();

// Always runs
app.use(function(req, res, next) {
	console.log(req.path);
	next(); // required for the request to continue running down the "pipeline"
});

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