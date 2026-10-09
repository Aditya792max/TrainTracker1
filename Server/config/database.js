const mongoose = require('mongoose');

let retryTimer = null;
let retryDelay = 10000;

function scheduleReconnect() {
	if (retryTimer) return;
	retryTimer = setTimeout(async () => {
		retryTimer = null;
		await connectDatabase();
	}, retryDelay);
	retryTimer.unref?.();
	retryDelay = Math.min(retryDelay * 2, 60000);
}

async function connectDatabase() {
	if (!process.env.MONGODB_URI) {
		console.warn('MongoDB is not configured; API will start in degraded mode.');
		return false;
	}
	if (mongoose.connection.readyState === 1) return true;
	try {
		await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
		retryDelay = 10000;
		console.log('Connected to MongoDB');
		return true;
	} catch (error) {
		const reason = [error.syscall, error.code].filter(Boolean).join(' ') || error.name;
		console.warn(`MongoDB unavailable (${reason}); retrying in ${Math.round(retryDelay / 1000)} seconds.`);
		scheduleReconnect();
		return false;
	}
}

module.exports = connectDatabase;
module.exports.isDatabaseConnected = () => mongoose.connection.readyState === 1;
