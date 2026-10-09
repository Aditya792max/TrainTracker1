const bcrypt = require('bcryptjs');
const User = require('../Models/User');

const safeUser = (user) => ({ id: user._id, name: user.name, age: user.age, aadhaarLast4: user.aadhaarLast4, email: user.email });

exports.getUsers = async (request, response, next) => {
	try { response.json({ users: [safeUser(request.user)] }); } catch (error) { next(error); }
};

exports.getUser = async (request, response, next) => {
	try {
		if (String(request.user._id) !== request.params.id) return response.status(403).json({ message: 'You can only view your own profile.' });
		response.json({ user: safeUser(request.user) });
	} catch (error) { next(error); }
};

exports.updateUser = async (request, response, next) => {
	try {
		if (String(request.user._id) !== request.params.id) return response.status(403).json({ message: 'You can only update your own profile.' });
		const allowed = ['name', 'age', 'aadhaarLast4', 'email'];
		for (const key of allowed) if (request.body[key] !== undefined) request.user[key] = request.body[key];
		if (request.body.password) {
			if (request.body.password.length < 8) return response.status(400).json({ message: 'Password must be at least 8 characters.' });
			request.user.password = await bcrypt.hash(request.body.password, 12);
		}
		await request.user.save();
		response.json({ user: safeUser(request.user) });
	} catch (error) { next(error); }
};

exports.deleteUser = async (request, response, next) => {
	try {
		if (String(request.user._id) !== request.params.id) return response.status(403).json({ message: 'You can only delete your own account.' });
		await request.user.deleteOne();
		response.status(204).end();
	} catch (error) { next(error); }
};
