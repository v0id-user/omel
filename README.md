# Omel CRM

Omel is a Bun-managed Next.js App Router CRM application with an Arabic-first interface, Better Auth-based authentication, tRPC APIs, and a Neon/Postgres backend.

The current repository contains the marketing site, authentication flows, an authenticated dashboard, contacts management, tasks management, legal pages, and internal dev-only test routes.

## Current stack

- Bun
- Next.js App Router
- React 19
- TypeScript
- tRPC
- Better Auth
- Neon serverless Postgres
- Drizzle ORM
- Upstash Redis
- PostHog
- Sentry
- Trigger.dev
- Resend
- Jest + Testing Library + Bun test

## Current product surface

- Marketing landing page
- Sign-in, sign-up, and clock-in routes
- Authenticated dashboard overview
- Contacts management flows
- Tasks management flows
- Privacy/legal route
- Dev-only test routes under `app/(tests)` when `NEXT_PUBLIC_ENV=dev`

## Getting started

1. Install dependencies:

```bash
bun install
```

2. Create a local `.env` file.

Use the safe setup guide in [`docs/development-environment.md`](docs/development-environment.md) instead of copying another developer's secrets.

3. Start the Next.js app:

```bash
bun dev
```

4. If you are testing Trigger.dev tasks such as welcome emails, start the worker in a second terminal:

```bash
bun run dev:trigger
```

5. Open [http://localhost:3000](http://localhost:3000).

## Development environment

The full secret-safe environment guide lives in [`docs/development-environment.md`](docs/development-environment.md).

At a minimum, local development usually needs:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_ENV=dev`
- `NEXT_PUBLIC_DEBUG=true`

Optional integrations currently used by the repo include:

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_SIGNUP_DEV_BYPASS`
- `RESEND_API_KEY`
- `ABSTRACT_API_KEY`
- `POLAR_SANDBOX_KEY`

Never commit real secrets, passwords, or connection strings.

## Useful commands

- `bun dev`
- `bun run dev:trigger`
- `bun run lint`
- `bun run typecheck`
- `bun run build`
- `bun run test`
- `bun run test:backend`
- `bun run test:frontend`
- `bun run verify`

## Testing

Omel uses Bun for backend-facing tests and Jest + Testing Library for frontend regression coverage.

- `__tests__/unit/` for pure utilities, contracts, validators, and small helpers
- `__tests__/integration/` for services, repositories, and router caller behavior
- `__tests__/api/` for route handlers and tRPC HTTP contracts
- `__tests__/frontend/` for React component behavior and regressions
- `__tests__/e2e/` for workflow-level coverage

The detailed testing conventions for this repo live in [`docs/testing.md`](docs/testing.md).

## CI / CD

GitHub Actions workflows live in:

- `.github/workflows/ci.yml`
- `.github/workflows/cd.yml`

The current CI pipeline runs:

- lint
- typecheck
- unit tests
- integration tests
- API tests
- frontend tests
- workflow tests
- production build

The current CD workflow deploys to Vercel when the required repository secrets are present:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Preview deployments are triggered from successful pull request workflow runs, and production deployments are triggered from successful pushes to the repository default branch.

## Deployment

The application is built for Vercel.

To produce a production build locally:

```bash
bun run build
```
