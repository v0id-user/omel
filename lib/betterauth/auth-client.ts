'use client';
import 'client-only';

import { createAuthClient } from 'better-auth/react';
import { twoFactorClient, organizationClient, phoneNumberClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [twoFactorClient(), organizationClient(), phoneNumberClient()],
});
