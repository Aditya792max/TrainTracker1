const { getRedisClient } = require('../config/redis');

const CAPACITY = 100;
const REFILL_PER_MS = CAPACITY / 60000;
const buckets = new Map();
const TOKEN_BUCKET_SCRIPT = `
local tokens = tonumber(redis.call('HGET', KEYS[1], 'tokens')) or tonumber(ARGV[1])
local updated = tonumber(redis.call('HGET', KEYS[1], 'updated')) or tonumber(ARGV[2])
local now = tonumber(ARGV[2])
tokens = math.min(tonumber(ARGV[1]), tokens + math.max(0, now - updated) * tonumber(ARGV[3]))
local allowed = 0
if tokens >= 1 then tokens = tokens - 1; allowed = 1 end
redis.call('HSET', KEYS[1], 'tokens', tokens, 'updated', now)
redis.call('PEXPIRE', KEYS[1], 120000)
return {allowed, math.floor(tokens)}
`;

async function consumeToken(key) {
	const now = Date.now();
	const redis = getRedisClient();
	if (redis?.isReady) {
		const [allowed, remaining] = await redis.eval(TOKEN_BUCKET_SCRIPT, {
			keys: [`rate:${key}`],
			arguments: [String(CAPACITY), String(now), String(REFILL_PER_MS)]
		});
		return { allowed: Number(allowed) === 1, remaining: Number(remaining) };
	}
	const bucket = buckets.get(key) || { tokens: CAPACITY, updated: now };
	bucket.tokens = Math.min(CAPACITY, bucket.tokens + Math.max(0, now - bucket.updated) * REFILL_PER_MS);
	bucket.updated = now;
	const allowed = bucket.tokens >= 1;
	if (allowed) bucket.tokens -= 1;
	buckets.set(key, bucket);
	return { allowed, remaining: Math.floor(bucket.tokens) };
}

module.exports = async function rateLimit(request, response, next) {
	try {
		const result = await consumeToken(request.ip);
		response.set('X-RateLimit-Limit', String(CAPACITY));
		response.set('X-RateLimit-Remaining', String(result.remaining));
		if (!result.allowed) return response.status(429).json({ message: 'Rate limit exceeded. Try again shortly.' });
		next();
	} catch (error) {
		next(error);
	}
};
