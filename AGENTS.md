# AGENTS.md

## Repository overview

- Omel is a Bun-managed Next.js App Router project deployed to Vercel.
- Core app stack in this repo: Next.js, React 19, TypeScript, tRPC, Better Auth, Neon, Drizzle, Trigger.dev, Sentry, PostHog, Tailwind CSS.
- Use `bun` and `bunx` as the default toolchain unless the user explicitly asks for another tool.
- There is no `src/` directory. Most application code lives at the repository root.

## First steps for any task

1. Read `package.json`, `README.md`, and this file before making changes.
2. Inspect the exact area you will touch instead of exploring the whole repo blindly.
3. Prefer targeted tests and targeted manual checks over broad repo-wide runs.
4. Do not overwrite or revert unrelated user changes in the worktree.

## Package manager and dependencies

- Use `bun install` for dependency installation.
- Use `bun run <script>` for package scripts.
- Use `bunx <cli>` for one-off CLIs.
- Prefer `bun`/`bunx` over `npm`, `npx`, `pnpm`, and `yarn`.
- Before adding a dependency, check `bun.lock` and existing code for an already-approved package.
- Prefer the existing stack over introducing alternatives:
  - auth: `better-auth`
  - database: Neon + Drizzle
  - API layer: tRPC
  - analytics/monitoring: PostHog + Sentry
  - AI SDK: `ai`
- Do not introduce a new framework, auth solution, ORM, or state library unless the user explicitly asks.

## Codebase map

- `app/`: Next.js App Router routes and layouts.
  - Route groups currently include `(landing)`, `(auth)`, `(main)`, `(legal)`, `(tests)`.
  - API handlers live under `app/api/`.
- `components/`: shared UI and feature components.
  - Reuse `components/ui/*` and `components/omel/*` before creating new primitives.
- `database/`: DB client, schema, relations, query helpers, and DB-facing types.
- `trpc/`: tRPC initialization, router composition, and client/server helpers.
- `lib/`: auth helpers, shared hooks, utilities, Redis/rate-limit helpers.
- `__tests__/`: Bun-backed unit/integration/api/workflow tests plus Jest frontend tests and shared helpers.
- `drizzle.config.ts`: Drizzle config. Schema source is `database/schema.ts`; generated output goes to `drizzle/`.

## Repo-specific coding conventions

- Use TypeScript and keep strict typing intact.
- Use the `@/*` import alias defined in `tsconfig.json`.
- Favor existing patterns in nearby files before introducing a new abstraction.
- Keep changes focused and local; avoid drive-by refactors unless required for the task.
- Do not remove existing comments.
- Do not add new code comments unless the user explicitly asks for them.
- When debugging production-style issues, prefer Sentry-oriented investigation if relevant.

## App and platform notes

- The app uses App Router, not Pages Router.
- tRPC HTTP entrypoint: `app/api/v1/[trpc]/route.ts`.
- Better Auth entrypoints/helpers live in `lib/betterauth/` and `app/api/auth/[...all]/route.ts`.
- MDX is enabled in `next.config.ts`; legal/docs-style routes may use `.mdx`.
- SVG imports are configured in `next.config.ts`; prefer the existing SVG import behavior instead of adding new loaders.
- Dev-only test pages exist under `app/(tests)/` and are gated by `NEXT_PUBLIC_ENV === "dev"`.

## Environment variables commonly needed

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_DEBUG`
- `NEXT_PUBLIC_ENV=dev` for the gated test routes under `app/(tests)/`
- Some billing/auth flows may also depend on optional Polar env vars such as `POLAR_SANDBOX_KEY`

## Commands

- Install deps: `bun install`
- Start dev server: `bun dev` or `bun run dev`
- Start Trigger.dev locally: `bun run dev:trigger`
- Lint: `bun run lint`
- Format: `bun run format`
- Build: `bun run build`
- Typecheck: `bun run typecheck`
- Run all tests: `bun run test`
- Run backend tests: `bun run test:backend`
- Run one Bun test file: `bun test __tests__/path/to/file.test.ts`
- Run frontend tests: `bun run test:frontend`
- Generate and apply Drizzle migrations: `bun run migration`
- Run ad-hoc package CLIs: `bunx <package>`

## Testing expectations

- Test every non-trivial code change.
- Prefer the smallest high-signal test scope that covers your change.
- Follow the conventions in `docs/testing.md` when adding or updating tests.
- Cover happy paths, edge cases, invalid input, and error conditions for the behavior you changed.
- Use descriptive `describe` and `it` names, and prefer nested `describe` blocks for scenario grouping.
- Keep tests independent, reset mocks in `beforeEach`, and avoid shared mutable state.
- Prefer small typed builders, local helpers, and shared fixtures in `__tests__/helpers/` over oversized inline setup.
- For UI changes:
  - run the dev server with `bun dev`
  - manually verify the changed route in the browser
  - use the existing `(tests)` routes if they are the fastest way to exercise the behavior
- For pure logic, contracts, and validators, prefer targeted Bun tests in `__tests__/unit/`.
- For services and router callers, prefer targeted Bun tests in `__tests__/integration/`.
- For API routes and tRPC HTTP behavior, prefer targeted Bun tests in `__tests__/api/`.
- For component regressions, prefer targeted Jest/Testing Library runs in `__tests__/frontend/`.
- Treat `__tests__/e2e/` as workflow-level coverage unless a real browser runner is introduced.
- Do not run the entire repo test surface unless the user asks or the change truly spans many areas.

## Cursor Cloud specific instructions

- Before starting long-running dev servers, check whether one is already running.
- Leave any dev server you started running when you finish so the user can continue from the same state.
- If you make a perceptible UI change, capture a screenshot and a short demo video after testing.
- If a required check fails because the environment is missing setup, document the exact blocker and the command/output that proved it.

## Good defaults for future agents

- Start with repository-native tools and patterns.
- Reuse existing components, utilities, and dependencies before adding new ones.
- Prefer narrowly scoped edits, narrowly scoped tests, and concise evidence of correctness.
