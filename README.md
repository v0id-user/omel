# Omel CRM

Omel (أوميل) is an Arabic-first CRM for small teams: contacts, a deal pipeline, tasks and an activity log, with each organization's data kept apart from every other's.

Built with Next.js 16 (App Router), React 19, tRPC, Better Auth (organizations), Drizzle on Postgres, and Bun.

## What works

- Sign-up wizard that creates your account and your organization (Arabic company names included)
- Dashboard with totals for contacts, tasks, open deals and overdue work
- Contacts: create, edit, search, filter, delete
- Deals: pipeline board by stage, values in SAR, linked to contacts and owners
- Tasks: due dates, priorities, linked contacts and assignees, grouped by status
- Activities: calls, meetings, emails and notes linked to contacts and deals
- Team and settings pages for the active organization

## Run it locally

You need [Bun](https://bun.sh) and Postgres 17 command-line tools (`brew install postgresql@17`). No Docker or cloud accounts.

```bash
cp .env.example .env.local      # then put a value in BETTER_AUTH_SECRET: openssl rand -base64 32
bun run setup                   # install, start local Postgres on :54329, apply migrations
bun run db:seed                 # optional demo account with sample data
bun dev
```

Open http://localhost:3000. Details, including every environment variable, are in [docs/development-environment.md](docs/development-environment.md).

## Commands

| Command                                      | What it does                                            |
| -------------------------------------------- | ------------------------------------------------------- |
| `bun dev`                                    | Start the app                                           |
| `bun run db:local [start\|stop\|status]`     | Manage the project-local Postgres                       |
| `bun run db:generate` / `bun run db:migrate` | Create / apply Drizzle migrations                       |
| `bun run db:seed`                            | Demo account with contacts, deals, tasks and activities |
| `bun run lint` / `bun run typecheck`         | Static checks                                           |
| `bun run test`                               | Backend (Bun) and frontend (Jest) tests                 |
| `bun run verify`                             | Lint, typecheck, tests and production build             |

## Security model

- Every CRM procedure runs through `protectedProcedure`, which confirms on each call that the user is still a member of the session's active organization.
- Queries, updates and deletes all filter by organization. Linked ids (contact, deal, task, owner, assignee) are checked to belong to the same organization before they are saved.
- Public procedures are rate limited per IP; sign-up has a stricter limit. Upstash is used when configured, otherwise an in-memory limiter.
- Accounts are created only through the sign-up flow; Better Auth's raw `/sign-up/email` endpoint is disabled.
- Unexpected server errors are replaced with a generic message in production.

Not done yet: email verification (needs a configured Resend sender) and role-based permissions inside an organization.

## Project layout

- `app/`: routes (`(landing)`, `(auth)`, `(main)` dashboard, `(legal)`) and API handlers
- `features/`: auth and CRM features, each with `contracts.ts` (zod), `server/` (router, service, repository) and `ui/`
- `database/`: Drizzle schema and client
- `trpc/`: tRPC setup and the root router
- `scripts/`: local Postgres and seed scripts
- `__tests__/`: unit, integration, API, workflow and frontend tests (see [docs/testing.md](docs/testing.md))
