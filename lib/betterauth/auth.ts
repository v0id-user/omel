import { betterAuth } from 'better-auth';
import { twoFactor } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/database/db';
import { NeonDialect } from 'kysely-neon';
import { emailHarmony } from 'better-auth-harmony';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
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
    database: new NeonDialect({
      connectionString: process.env.DATABASE_URL,
    }),
  },
  plugins: [
    emailHarmony(),
    twoFactor(),

    // This must be the last plugin
    nextCookies(),
  ],
});
