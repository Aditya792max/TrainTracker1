const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true, maxlength: 80 },
	age: { type: Number, required: true, min: 1, max: 120 },
	aadhaarLast4: { type: String, required: true, match: /^\d{4}$/ },
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	password: { type: String, required: true, select: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
