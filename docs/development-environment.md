# Development environment

Omel runs fully on your machine: a project-local Postgres, no Docker, and no cloud accounts. Every third-party integration stays off until you set its key.

## First run

```bash
cp .env.example .env.local
# put a value in BETTER_AUTH_SECRET: openssl rand -base64 32
bun run setup      # bun install, start local Postgres, apply migrations
bun run db:seed    # optional: demo account with sample contacts, deals, tasks and activities
bun dev
```

Open http://localhost:3000. The seed prints the demo login (`demo@omel.test` unless `SEED_EMAIL` is set).

## Local Postgres

`bun run db:local` keeps a Postgres 17 data directory in `.dev/pgdata` (gitignored) and serves it on port `54329`, so it never collides with another Postgres on 5432. It needs `initdb`/`pg_ctl` on your PATH (`brew install postgresql@17`).

- `bun run db:local` starts it (and creates it on first run)
- `bun run db:local stop` stops it
- `bun run db:local status` shows whether it is running

The app talks to Postgres through `postgres-js`, so the same code works against Neon, Railway or any other Postgres: only `DATABASE_URL` changes.

## Migrations

The schema lives in `database/schema.ts`. After changing it:

```bash
bun run db:generate   # writes a new SQL file to drizzle/
bun run db:migrate    # applies pending migrations
```

`drizzle/0000_baseline.sql` is the full schema as of the revival. The earlier migration history could not build a fresh database (the auth tables were never in it), so it was replaced by this single baseline.

## Environment variables

| Variable                                               | Required | Purpose                                                                                                    |
| ------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                         | Yes      | Postgres connection string                                                                                 |
| `BETTER_AUTH_SECRET`                                   | Yes      | Signs sessions; at least 32 random characters                                                              |
| `BETTER_AUTH_URL`                                      | Yes      | Public base URL; also the only trusted origin for auth requests                                            |
| `NEXT_PUBLIC_ENV`                                      | Yes      | `dev` locally                                                                                              |
| `NEXT_PUBLIC_DEBUG`                                    | No       | Extra debug logging through `utils/logs`                                                                   |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`  | No       | Shared rate-limit store. Without them, limits are kept in memory per process, which is fine for one server |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` | No       | Product analytics                                                                                          |
| `NEXT_PUBLIC_SENTRY_DSN`                               | No       | Error reporting                                                                                            |
| `RESEND_API_KEY`                                       | No       | Welcome emails (sent through Trigger.dev)                                                                  |
| `ABSTRACT_API_KEY`                                     | No       | Hosted email validation; built-in checks are used without it                                               |
| `POLAR_SANDBOX_KEY`                                    | No       | Polar billing (sandbox)                                                                                    |

Never commit real values. `.env*` is gitignored except `.env.example`.

## Background jobs

Trigger.dev tasks live in `trigger/`. Run `bun run dev:trigger` in a second terminal only when testing them; sign-up works without it.
