import { redis } from '@/lib/queue/redis';

/**
 * Simple Sliding Window or Leaky Bucket Rate Limiter using Redis.
 * Returns true if request is allowed, false if blocked.
 */
export class RateLimiter {

    /**
     * Checks if a user has exceeded their rate limit.
     * @param identifier Unique ID (e.g. userId or IP)
     * @param limit Max requests allowed
     * @param windowSeconds Time window in seconds
     */
    static async check(identifier: string, limit: number = 5, windowSeconds: number = 60): Promise<{ allowed: boolean; remaining: number }> {
        const key = `rate_limit:${identifier}`;

        // Increment the counter
        const currentCount = await redis.incr(key);

        // If it's the first request (count === 1), set the expiration
        if (currentCount === 1) {
            await redis.expire(key, windowSeconds);
        }

        if (currentCount > limit) {
            return { allowed: false, remaining: 0 };
        }

        return { allowed: true, remaining: limit - currentCount };
    }
}
