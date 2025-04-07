import { betterAuth } from 'better-auth';
import { twoFactor, organization } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/database/db';
import { NeonDialect } from 'kysely-neon';
import { emailHarmony } from 'better-auth-harmony';
import { polar } from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';

const client = new Polar({
  accessToken: process.env.POLAR_SANDBOX_KEY,
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
  server: 'sandbox',
});

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
    organization(),
    polar({
      client,
      // Enable automatic Polar Customer creation on signup
      createCustomerOnSignUp: true,
      // Enable customer portal
      enableCustomerPortal: true, // Deployed under /portal for authenticated users

      // webhooks: {

      // },
    }),
    // This must be the last plugin
    nextCookies(),
  ],
});
