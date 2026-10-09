const { createClient } = require('redis');

let redisClient = null;

async function connectRedis() {
	if (!process.env.REDIS_URL) {
		console.warn('REDIS_URL is not set; rate limiting will use process memory.');
		return;
	}
	redisClient = createClient({
		url: process.env.REDIS_URL,
		socket: {
			reconnectStrategy: () => false
		}
	});
	redisClient.on('error', (error) => console.error('Redis error:', error.message));
	try {
		await redisClient.connect();
		console.log('Connected to Redis');
	} catch (error) {
		console.warn(`Redis unavailable (${error.code || error.name}); using in-memory rate limiting.`);
		redisClient.destroy();
		redisClient = null;
	}
}

module.exports = { getRedisClient: () => redisClient, connectRedis };
