const { isDatabaseConnected } = require('../config/database');

module.exports = function databaseReady(request, response, next) {
	if (isDatabaseConnected()) return next();
	response.status(503).json({
		code: 'DATABASE_UNAVAILABLE',
		message: 'Database is temporarily unavailable. Please try again shortly.'
	});
};
