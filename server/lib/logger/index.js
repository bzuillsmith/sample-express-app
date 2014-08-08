var bunyan = require('bunyan');
var onFinished = require('finished');
var settings = require('../settings');

// TODO: Things are a little messy in here. Cleanup.

// Do pretty printing when in development, otherwise use json
var out, level;
if(settings.env === 'development') {
	var PrettyStream = require('bunyan-prettystream');
	out = new PrettyStream({ mode: 'short' });
	out.pipe(process.stdout);
	level = 'debug'
} else {
	out = process.stdout,
	level = 'info'
}

// Currently, all loggers use the same output streams
var streams = [{
	level: level,
	stream: out
}];

// Used for logs specific to express operations
var expressLogger = module.exports.express = bunyan.createLogger({
	name: 'express',
	streams: streams,
	serializers: { err: bunyan.stdSerializers.err }
});

// Used as a general logger throughout our app
module.exports.app = bunyan.createLogger({
	name: 'app',
	streams: streams,
	serializers: { err: bunyan.stdSerializers.err }
});

/**
 * Middleware for express request logs. It waits for the response and then
 * logs relevant info about both the request and response
 * @param format
 * @returns {Function}
 */
module.exports.requestLogger = function(format) {

	return function (req, res, next) {
		req._startAt = process.hrtime();
		req._remoteAddress = req.connection && req.connection.remoteAddress;

		function logRequest(){

			if(format === 'development') {
				expressLogger.info({
					method: req.method,
					url: url(req),
					status: status(req, res),
					responseTime: responseTime(req, res)
				}, 'request');
			} else {
				expressLogger.info({
					remoteAddress: remoteAddress(req),
					date: date(),
					method: req.method,
					url: url(req),
					httpVersion: httpVersion(req),
					status: status(req, res),
					userAgent: userAgent(req)
				}, 'request')
			}
		};

		onFinished(res, logRequest);

		next();
	}

};

function url(req) {
	return req.originalUrl || req.url;
}

function responseTime(req, res) {
	if (!res._header || !req._startAt) return '';
	var diff = process.hrtime(req._startAt);
	var ms = diff[0] * 1e3 + diff[1] * 1e-6;
	return ms.toFixed(3);
}

function status(req, res) {
	return res._header ? res.statusCode : null;
}

function remoteAddress(req) {
	if (req.ip) return req.ip;
	if (req._remoteAddress) return req._remoteAddress;
	if (req.connection) return req.connection.remoteAddress;
	return undefined;
}

/**
 * UA string
 */

function userAgent(req){
	return req.headers['user-agent'];
}

/**
 * HTTP version
 */
function httpVersion(req){
	return req.httpVersionMajor + '.' + req.httpVersionMinor;
}

/**
 * UTC date
 */

function date() {
	return new Date().toUTCString();
}
