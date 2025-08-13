import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import "dotenv/config";

// Creates a Redis client using Upstash credentials from environment variables
const ratelimiter = new Ratelimit({
redis: Redis.fromEnv(),
limiter: Ratelimit.slidingWindow(5, "60 s"), // 4 requests per minute
});

export default ratelimiter;



