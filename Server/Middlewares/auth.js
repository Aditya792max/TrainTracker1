const jwt = require('jsonwebtoken');
const User = require('../Models/User');

async function authenticate(request, response, next) {
	try {
		const token = request.headers.authorization?.startsWith('Bearer ')
			? request.headers.authorization.slice(7)
			: null;
		if (!token) return response.status(401).json({ message: 'Authentication required.' });
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(payload.sub);
		if (!user) return response.status(401).json({ message: 'Session is no longer valid.' });
		request.user = user;
		next();
	} catch (error) {
		response.status(401).json({ message: 'Invalid or expired token.' });
	}
}

module.exports = authenticate;
