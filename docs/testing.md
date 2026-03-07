# Omel testing standards for Next.js and TypeScript

This project uses Bun, Jest, Testing Library, and Next.js App Router. The testing style should stay close to the intent of the original RSpec guidance while matching the tools that already exist in Omel.

## Core expectations

- Cover the happy path, edge cases, invalid input, and failure modes for every non-trivial change.
- Prefer small, focused tests with explicit assertions over broad tests with many unrelated expectations.
- Use descriptive `describe` and `it` names that read like behavior.
- Use `expect(...)` assertions directly and avoid indirect assertion styles.
- Keep every test independent. Reset mocks and avoid shared mutable state between examples.

## Map the RSpec ideas to Omel

### Structure

- Use `describe` for the module, route, component, or service under test.
- Use nested `describe` blocks for scenarios that would normally be `context` in RSpec.
- Use local helper functions such as `renderDialog()` or `createCaller()` where RSpec would normally use `subject`.
- Keep test files in the test bucket that matches the behavior being exercised:
  - `__tests__/unit/` for pure functions, validators, schema contracts, and utilities
  - `__tests__/integration/` for services, router callers, and cross-module behavior
  - `__tests__/api/` for route handlers and tRPC HTTP contracts
  - `__tests__/frontend/` for React components, hooks, and regression coverage with Testing Library
  - `__tests__/e2e/` for workflow-level coverage; reserve true browser/system coverage for real browser tooling

### File placement

- Mirror the feature or domain path inside the correct test bucket whenever practical.
- Examples:
  - `utils/numerals.ts` -> `__tests__/unit/utils/numerals.test.ts`
  - `app/api/v1/[trpc]/route.ts` -> `__tests__/api/trpc-http.test.ts`
  - `app/(main)/dashboard/tasks/dialog.tsx` -> `__tests__/frontend/tasks/task-dialog.regression.test.tsx`

### Test data

- Prefer the smallest possible setup with `const`, small factory helpers, and typed builders.
- Reuse shared helpers in `__tests__/helpers/fixtures.ts` and `__tests__/helpers/` before creating new ad-hoc data builders.
- Keep test data local when only one file needs it.
- Promote repeated setup into helpers only when it genuinely reduces duplication.

### Isolation

- Mock boundaries, not the unit itself.
- Mock external services such as auth, Redis, network calls, database access boundaries, and navigation when the goal is unit or component isolation.
- Prefer real behavior for parsers, validation, mapping logic, and pure business rules.
- Reset mocks in `beforeEach` and avoid state that leaks across tests.

### Readability

- Name examples after user-visible or developer-visible behavior, not implementation details.
- Assert the exact behavior that matters for the scenario being tested.
- Use small helper functions to reduce repetition instead of deeply nested setup.
- Use `describe.each` for the same behavior across multiple inputs.

## What to test by surface area

### Unit specs

Use `bun:test` in `__tests__/unit/` for:

- utility functions
- schema validation
- data normalization
- contract parsing
- small pure helpers

Every unit change should include:

- valid input coverage
- invalid input coverage
- boundary values
- explicit error behavior when applicable

### Integration specs

Use `bun:test` in `__tests__/integration/` for:

- service methods
- tRPC caller behavior
- cross-module coordination
- repository orchestration with mocked boundaries

Every integration change should include:

- success behavior
- dependency failure behavior
- empty-state behavior where relevant
- permission or session variants when auth is part of the flow

### API specs

Use `bun:test` in `__tests__/api/` for:

- route handlers
- request validation
- status codes or response shape
- tRPC HTTP contracts

Every API change should include:

- valid request coverage
- invalid request coverage
- unauthorized or forbidden flows when relevant
- error response behavior

### Frontend specs

Use Jest + Testing Library in `__tests__/frontend/` for:

- client components
- interactive forms and dialogs
- rendering branches
- regression coverage for previously broken UI behavior

Every frontend change should include:

- default render behavior
- user interaction coverage
- invalid or disabled states
- loading, empty, and error states when the component supports them

## Reuse without repetition

- Use file-local helpers first.
- Use shared helpers in `__tests__/helpers/` when multiple files need the same setup.
- Use `describe.each` and typed helper assertions for repeated scenarios.
- Avoid copying large mock objects; extract a builder or fixture instead.

## CI and release gates

Omel treats a change as ready when it passes:

1. lint
2. typecheck
3. backend test lanes
4. frontend regression tests
5. production build

Deployment should happen only after CI succeeds. For this repo, the deployment target is Vercel.

## Commands

- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:backend`
- `bun run test:frontend`
- `bun run verify`
