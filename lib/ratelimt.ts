import { Ratelimit, type Duration } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type Limiter = { limit: (key: string) => Promise<{ success: boolean }> };

const upstashConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

function toMilliseconds(window: `${number} ${'s' | 'm'}`) {
  const [amount, unit] = window.split(' ');
  return Number(amount) * (unit === 'm' ? 60_000 : 1_000);
}

function createMemoryLimiter(limit: number, windowMs: number): Limiter {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return {
    async limit(key) {
      const now = Date.now();
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true };
      }
      entry.count += 1;
      return { success: entry.count <= limit };
    },
  };
}

// Upstash in deployed environments; a per-process limiter when it isn't configured.
function createLimiter(prefix: string, limit: number, window: `${number} ${'s' | 'm'}`): Limiter {
  if (!upstashConfigured) {
    return createMemoryLimiter(limit, toMilliseconds(window));
  }

  return new Ratelimit({
    redis: Redis.fromEnv(),
    prefix: `omel:${prefix}`,
    limiter: Ratelimit.slidingWindow(limit, window.replace(' ', '') as Duration),
  });
}

// Signed-in users, keyed by user id.
export const ratelimit = createLimiter('user', 100, '10 s');

// Public procedures, keyed by client IP.
export const publicRatelimit = createLimiter('public', 30, '1 m');

// Account creation, keyed by client IP.
export const signupRatelimit = createLimiter('signup', 5, '10 m');
