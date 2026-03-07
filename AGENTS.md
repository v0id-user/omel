# Omel CRM

## Cursor Cloud specific instructions

### Overview

Omel CRM is an Arabic-language (RTL) customer relationship management app built with Next.js 15 (App Router), deployed on Vercel. All external services (Neon PostgreSQL, Upstash Redis, Resend, Polar, PostHog, Sentry) are cloud-hosted SaaS — no Docker or containers needed.

### Running the app

- **Package manager**: Bun (`bun install`, `bun dev`, etc.). See `package.json` `scripts` for all commands.
- **Dev server**: `bun dev` starts Next.js on port 3000.
- **Lint**: `bun lint` (runs `next lint`).
- **Tests**: `bun test` (runs Bun's built-in test runner, not Jest despite the devDep).
- **Format**: `bun format` (Prettier).
- **DB migrations**: `bun run migration` (generates + applies Drizzle migrations). For a fresh database, use `bunx drizzle-kit push` instead, as incremental migration files assume prior state.

### Environment variables

A `.env` file is required at the project root. Minimum viable set:

```
DATABASE_URL=<neon-postgres-connection-string>
BETTER_AUTH_SECRET=<any-random-hex-string>
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_ENV=dev
NEXT_PUBLIC_DEBUG=true
```

For full functionality (rate limiting on protected routes, billing, email):

```
UPSTASH_REDIS_REST_URL=<upstash-url>
UPSTASH_REDIS_REST_TOKEN=<upstash-token>
POLAR_SANDBOX_KEY=<polar-key>
RESEND_API_KEY=<resend-key>
```

### Gotchas

- **Production build** (`bun run build`) fails even with all env vars set because `/dashboard/tasks` prerenders and calls a tRPC procedure requiring an authenticated session. This is a codebase issue (the page does `await trpc.crm.dashboard.contact.getBulk.prefetch()` at build time). The dev server is unaffected.
- **Sign-up form in dev mode**: When `NEXT_PUBLIC_ENV=dev`, clicking "Continue" auto-skips validation AND returns early before the step's backend logic runs (see `app/(auth)/sign-up/steps.tsx` line ~193). The `FinalStep` handler that creates the user+org via tRPC never fires in dev mode. To test actual account creation, call the Better Auth API directly: `curl -X POST http://localhost:3000/api/auth/sign-up/email -H "Content-Type: application/json" -d '{"email":"...","password":"...","name":"..."}'`.
- **Stale `.next` directory**: If you ran `bun run build` and it failed, delete `.next/` before running `bun dev` to avoid `prerender-manifest.json` ENOENT errors.
- **Husky pre-commit hook** runs `bun format`, `bun lint --fix`, `git add .`, then `bun lint`. The commit-msg hook runs commitlint (conventional commits).
- **Next.js canary**: The project uses `next@15.4.0-canary.87` with `experimental.nodeMiddleware`. This is intentional.
- **Bun test runner**: Despite `jest` being in devDependencies, `bun test` uses Bun's built-in test runner which picks up `__tests__/**/*.test.ts` and `__tests__/**/*.spec.ts` files.
