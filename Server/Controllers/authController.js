const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const publicUser = (user) => ({
	id: user._id,
	name: user.name,
	age: user.age,
	aadhaarLast4: user.aadhaarLast4,
	email: user.email
});

exports.register = async (request, response, next) => {
	try {
		const { name, age, aadhaarLast4, email, password } = request.body;
		if (!name || !age || !aadhaarLast4 || !email || !password) {
			return response.status(400).json({ message: 'Please provide all required fields.' });
		}
		if (!/^\d{4}$/.test(aadhaarLast4)) return response.status(400).json({ message: 'Aadhaar must contain only its last four digits.' });
		if (String(password).length < 8) return response.status(400).json({ message: 'Password must be at least 8 characters.' });
		if (await User.exists({ email: String(email).toLowerCase() })) return response.status(409).json({ message: 'An account with this email already exists.' });
		const user = await User.create({ name, age, aadhaarLast4, email, password: await bcrypt.hash(password, 12) });
		const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		response.status(201).json({ user: publicUser(user), token });
	} catch (error) { next(error); }
};

exports.login = async (request, response, next) => {
	try {
		const user = await User.findOne({ email: String(request.body.email || '').toLowerCase() }).select('+password');
		if (!user || !(await bcrypt.compare(request.body.password || '', user.password))) {
			return response.status(401).json({ message: 'Email or password is incorrect.' });
		}
		const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		response.json({ user: publicUser(user), token });
	} catch (error) { next(error); }
};

exports.me = (request, response) => response.json({ user: publicUser(request.user) });
