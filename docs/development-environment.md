# Development environment

This document describes the current Omel development environment without publishing secrets.

It intentionally does not include passwords, API tokens, raw connection strings, or copied values from any local `.env` file. Authorized contributors should retrieve those values from the relevant provider dashboard or from a project maintainer.

## Local development overview

The app currently runs on:

- Bun
- Next.js App Router
- React 19
- TypeScript
- tRPC
- Better Auth
- Neon serverless Postgres with Drizzle
- Upstash Redis for rate limiting
- PostHog
- Sentry
- Trigger.dev
- Resend

Typical startup flow:

1. Install dependencies with `bun install`
2. Create a local `.env`
3. Start the web app with `bun dev`
4. Start Trigger.dev locally with `bun run dev:trigger` when testing background jobs

## Secret handling rules

- Never commit a real `.env` file
- Never paste a live Neon connection string, Upstash token, auth secret, or provider API key into versioned docs
- Treat local `.env` values as disposable local configuration, not documentation
- If you need access, ask an authorized maintainer or use the provider dashboard for your account

The repo already ignores `.env*` files in `.gitignore`.

## Environment variables in current use

### Core local app variables

| Variable                   | Required                              | Used in                                                                   | Purpose                                                        | How authorized contributors should get it                                                                  |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`             | Yes                                   | `database/db.ts`, `drizzle.config.ts`                                     | Connects the app and Drizzle tooling to Neon Postgres          | Generate a development connection string from the Neon project for the `main` branch and `neondb` database |
| `BETTER_AUTH_SECRET`       | Yes                                   | `lib/betterauth/auth.ts`                                                  | Signs Better Auth sessions and auth-related tokens             | Generate a strong local secret or use the team-approved development secret if one exists                   |
| `BETTER_AUTH_URL`          | Yes                                   | `lib/betterauth/auth-client.ts`                                           | Sets the base URL for Better Auth client calls                 | Use `http://localhost:3000` for standard local development                                                 |
| `UPSTASH_REDIS_REST_URL`   | Yes for authenticated dashboard flows | `lib/redis.ts`, `lib/ratelimt.ts`, `trpc/init.ts`                         | Powers request rate limiting on protected tRPC procedures      | Copy the development REST URL from the Upstash project used by the team                                    |
| `UPSTASH_REDIS_REST_TOKEN` | Yes for authenticated dashboard flows | `lib/redis.ts`, `lib/ratelimt.ts`, `trpc/init.ts`                         | Authenticates requests to the Upstash Redis REST API           | Copy the development REST token from the Upstash project used by the team                                  |
| `NEXT_PUBLIC_ENV`          | Yes                                   | dev-only routes under `app/(tests)`, logging helpers, signup bypass logic | Enables development-only routes and behavior when set to `dev` | Set to `dev` locally                                                                                       |
| `NEXT_PUBLIC_DEBUG`        | Recommended                           | `app/api/hello/route.ts` and debug-oriented test helpers                  | Enables lightweight debug behavior used by local/test helpers  | Set to `true` in local development unless you explicitly want it off                                       |

### Optional local variables

| Variable                        | Required | Used in                                                                 | Purpose                                                    | How authorized contributors should get it                                                                              |
| ------------------------------- | -------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY`       | Optional | `app/providers.tsx`                                                     | Enables PostHog analytics in the browser                   | Copy the development project key from PostHog if local analytics testing is needed                                     |
| `NEXT_PUBLIC_POSTHOG_HOST`      | Optional | `app/providers.tsx`                                                     | Overrides the PostHog API host                             | Use the team PostHog host or leave it unset to fall back to `https://us.i.posthog.com`                                 |
| `NEXT_PUBLIC_SIGNUP_DEV_BYPASS` | Optional | `features/auth/hooks/useSignUpFlow.tsx`, `app/(auth)/sign-up/steps.tsx` | Skips signup step validation in development-only scenarios | Set to `true` only when intentionally bypassing the signup wizard locally                                              |
| `RESEND_API_KEY`                | Optional | `utils/emails/sendEmail.tsx`, Trigger email task flow                   | Sends welcome emails through Resend                        | Copy a development Resend API key if testing email delivery                                                            |
| `ABSTRACT_API_KEY`              | Optional | `utils/emails/validate.ts`                                              | Enables Abstract email validation API checks               | Copy a development Abstract API key if testing hosted validation; without it the app falls back to built-in validation |
| `POLAR_SANDBOX_KEY`             | Optional | `lib/betterauth/auth.ts`                                                | Enables optional Polar sandbox integration in auth         | Copy a sandbox key only if testing Polar-backed billing/auth flows                                                     |

### Platform-supplied variables

| Variable     | Expected source             | Used in           | Notes                                                      |
| ------------ | --------------------------- | ----------------- | ---------------------------------------------------------- |
| `VERCEL_URL` | Vercel runtime              | `trpc/client.tsx` | Used to compute a server-side base URL outside the browser |
| `CI`         | GitHub Actions or CI runner | `next.config.ts`  | Controls CI-oriented Next.js and build behavior            |

## Current Neon development database

The current development database metadata that is safe to publish:

- Project name: `omel-crm-dev`
- Region: `aws-us-west-2`
- PostgreSQL version: `17`
- Default branch: `main`
- Default database: `neondb`

This is enough context for contributors to locate the right development database without publishing credentials.

### Current database shape

The `main` development branch currently contains both auth and CRM tables.

Auth-related tables include:

- `users`
- `sessions`
- `accounts`
- `organizations`
- `members`
- `invitations`
- `verifications`
- `two_factors`
- `rate_limits`

CRM and product tables include:

- `contacts`
- `tasks`
- `categories`
- `subscriptions`
- `usage_counters`
- `activity_logs`

Migration tracking is stored in:

- `drizzle.__drizzle_migrations`

When you need a live connection string, generate it from Neon for the `main` branch and `neondb` database instead of copying one from another developer.

## Integration notes

### Better Auth

Better Auth is configured in `lib/betterauth/auth.ts` with organization, phone-number, and two-factor plugins. The app also exposes auth handlers through `app/api/auth/[...all]/route.ts`.

### tRPC

tRPC is served from `app/api/v1/[trpc]/route.ts` and uses auth-aware context from `trpc/init.ts`.

### Upstash Redis

Protected procedures call the Upstash-backed rate limiter in `trpc/init.ts`. Local dashboard flows are not fully representative unless the Upstash variables are configured.

### PostHog

PostHog is initialized in `app/providers.tsx`. Local analytics testing is optional, but these variables should be present if you want realistic event collection behavior.

### Trigger.dev and Resend

Trigger.dev tasks live under `trigger/`. The welcome email flow is queued from `services/crm/new/createNewCRM.ts` and delivered through Resend in `utils/emails/sendEmail.tsx`.

If you are testing background email delivery locally, run both:

```bash
bun dev
bun run dev:trigger
```

### Abstract email validation

If `ABSTRACT_API_KEY` is missing, `utils/emails/validate.ts` falls back to local structural validation. That means email validation still works in development, but without the hosted deliverability checks.

### Sentry and Trigger.dev config

Sentry DSNs and the Trigger.dev project reference are currently configured in repo files rather than through the local `.env` contract. Review:

- `instrumentation.ts`
- `instrumentation-client.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `trigger.config.ts`

## Test and CI environment

The repository already defines a test-friendly environment in two places:

- `__tests__/preload.ts` sets fallback values for `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_ENV`, and `NEXT_PUBLIC_DEBUG`
- `.github/workflows/ci.yml` injects CI-safe values and provisions a temporary Postgres service for integration and workflow test lanes

That means CI does not depend on production secrets for the core test matrix.

## Recommended local `.env` checklist

Use this checklist when creating your local `.env`:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL=http://localhost:3000`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_ENV=dev`
- `NEXT_PUBLIC_DEBUG=true`

Add these only when needed:

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_SIGNUP_DEV_BYPASS`
- `RESEND_API_KEY`
- `ABSTRACT_API_KEY`
- `POLAR_SANDBOX_KEY`

## Sanity check after setup

After your local `.env` is ready:

1. Run `bun dev`
2. Open `http://localhost:3000`
3. Verify the landing page loads
4. Verify auth routes such as `/sign-in` and `/sign-up`
5. If `NEXT_PUBLIC_ENV=dev`, verify the internal test routes are available
6. If you are testing background tasks, start `bun run dev:trigger`
