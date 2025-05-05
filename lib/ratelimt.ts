import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

export const ratelimit = new Ratelimit({
  redis,
  // 100 requests per 10 seconds == 10 requests per second is allowed
  limiter: Ratelimit.slidingWindow(100, '10s'),
});
