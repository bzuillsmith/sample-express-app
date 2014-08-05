var util = require('util');

util.inherits(ValidationError, Error);

/**
 * Creates a validation error
 * ValdiationError([message,] validationErrors)
 * @param {string}  message          optional custom message
 * @param {array}   validationErrors list of errors from z-schema validator
 */
function ValidationError(message, validationErrors) {
	if(typeof message === 'object') {
		validationErrors = message;
		message = 'Validation error';
	}

	this.message = message;
	this.errors = validationErrors;
	this.status = 400;

	Error.captureStackTrace(this, this.constructor)
}

module.exports = ValidationError;
