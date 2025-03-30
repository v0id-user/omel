import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { twoFactor } from 'better-auth/plugins';
import { anonymous } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  rateLimit: {
    enabled: true,
    limit: 10,
    window: 10000,
    storage: 'database',
    database: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  },
  plugins: [
    twoFactor(),
    anonymous(),

    // This must be the last plugin
    nextCookies(),
  ],
});
