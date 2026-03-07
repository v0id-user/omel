# [abandoned project] Omel CRM

A customer relationship management system built with Next.js and hosted on Vercel.

## Tech Stack

- **Next.js** – Framework
- **Tigris Data** – Storage
- **Bunny** – CDN, Image Processing
- **Neon** – Database (serverless PostgreSQL)
- **Better Auth** – Authentication solution
- **Upstash** – Caching & Workflows
- **PostHog** – Analytics & event tracking
- **OpenAI / RecomBee** – Recommendation engine
- **Resend** – Email handling
- **Twilio** – SMS functionality
- **Sentry** – Performance monitoring & error tracking
- **TRPC** – Data fetching and EndToEnd Type Safety

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file with the required variables (see Environment Variables section)
4. Run the development server:

```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=your_auth_url
DATABASE_URL=your_neon_database_url

NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=your_posthog_host
NEXT_PUBLIC_DEBUG=true_or_false
```

## Development Guidelines

1. **Tech Stack Compliance**: Use only the approved technologies in the tech stack list.
2. **Security & Performance**: Optimize code for security and performance.
3. **Monitoring**: Use Sentry for performance monitoring and error tracking.

## Testing

Omel uses Bun for backend-facing tests and Jest + Testing Library for frontend regression coverage.

- `__tests__/unit/` - pure utilities, contracts, validators
- `__tests__/integration/` - services and router callers
- `__tests__/api/` - route handlers and tRPC HTTP contracts
- `__tests__/frontend/` - React component behavior and regressions
- `__tests__/e2e/` - workflow-level coverage

Recommended commands:

- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:backend`
- `bun run test:frontend`
- `bun run verify`

Project-specific testing standards live in `docs/testing.md`.

## CI / CD

GitHub Actions is expected to enforce linting, type checking, backend tests, frontend tests, and a production build before deployment.

Deployment targets Vercel. To enable automated deployments from GitHub Actions, configure these repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Deployment

The project is deployed on the Vercel platform.

```bash
bun run build
```

# Project Status

**Actively Developed & Rapidly Evolving**  
Omel CRM is in continuous, high-priority development. Expect frequent updates, new features, and improvements as we work toward delivering a best-in-class CRM experience.
