const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const connectDatabase = require('./config/database');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 5000;

async function startServer() {
	if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
		throw new Error('JWT_SECRET is missing or too short. Set a random secret of at least 32 characters in Server/.env.');
	}
	await connectDatabase();
	await connectRedis();
	app.listen(PORT, () => {
		console.log(`Train Tracker API listening on port ${PORT}`);
	});
}

startServer().catch((error) => {
	console.error('Unable to start server:', error.message);
	process.exit(1);
});
