var fs = require('fs');
var path = require('path');
var express = require('express');

module.exports = function(db) {

	var router = express.Router();
	var files = fs.readdirSync(__dirname);

	files.forEach(function(file) {
		var registerRoute;

		if(file === 'index.js') return;

		registerRoute = require(path.join(__dirname, file));
		registerRoute(router, db);
	});

	return router;
};