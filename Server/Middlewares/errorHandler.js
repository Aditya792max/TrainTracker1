module.exports = function errorHandler(error, request, response, next) {
	console.error(error);
	if (error.code === 11000) return response.status(409).json({ message: 'An account with this email already exists.' });
	if (error.name === 'ValidationError' || error.name === 'CastError') {
		return response.status(400).json({ message: error.message });
	}
	response.status(error.status || 500).json({ message: error.message || 'Something went wrong.' });
};
