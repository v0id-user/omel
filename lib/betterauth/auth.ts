import { betterAuth } from 'better-auth';
import { twoFactor, organization, phoneNumber } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/database/db';
import { emailHarmony } from 'better-auth-harmony';
import { polar } from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';
import {
  users,
  sessions,
  accounts,
  organizations,
  members,
  invitations,
  verifications,
  twoFactors,
  rateLimits,
} from '@/database/schemas/auth-schema';

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
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      organization: organizations,
      member: members,
      invitation: invitations,
      verification: verifications,
      twoFactor: twoFactors,
      rateLimit: rateLimits,
    },
  }),
  databaseHooks: {
    session: {
      create: {
        async before(session, context) {
          interface SessionMeta {
            serverTime: string;
            deviceInfo?: string;
          }
          const metadata: SessionMeta = {
            serverTime: new Date().toISOString(),
            // Safely access user-agent if available
            deviceInfo: context?.request?.headers
              ? typeof context.request.headers.get === 'function'
                ? context.request.headers.get('user-agent') || undefined
                : undefined
              : undefined,
          };
          return {
            data: {
              ...session,
              metadata: JSON.stringify(metadata),
            },
          };
        },
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  rateLimit: {
    enabled: true,
    max: 10,
    window: 100,
    storage: 'database',
    customRules: {
      '/two-factor/*': async request => {
        console.log('Two factor request:', request);
        return {
          window: 10,
          max: 3,
        };
      },
    },
  },
  plugins: [
    phoneNumber(),
    twoFactor(),
    organization(),
    emailHarmony(),
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
