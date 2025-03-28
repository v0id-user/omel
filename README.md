# Omel CRM

A customer relationship management system built with Next.js and hosted on Vercel.

## Tech Stack

- **Next.js** – Framework
- **Bunny** – File Storage, CDN, Image Processing
- **Neon** – Database (serverless PostgreSQL)
- **Better Auth** – Authentication solution
- **Electric SQL / WatermelonDB / PouchDB** – Client-side database options
- **Upstash** – Caching & Workflows
- **PostHog** – Analytics & event tracking
- **Get Stream** – Chat, Video, and Audio features
- **DaisyUI** – UI Components & styling
- **OpenAI / RecomBee** – Recommendation engine
- **Resend** – Email handling
- **Twilio** – SMS functionality
- **Sentry** – Performance monitoring & error tracking
- **SWR** – Data fetching and caching

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
2. **Package Management**: Always check `bun.lock` for existing packages before adding new dependencies.
3. **Mandatory Packages**: Ensure `ai-sdk` and `swr-sdk` are integrated.
4. **Security & Performance**: Optimize code for security and performance.
5. **Monitoring**: Use Sentry for performance monitoring and error tracking.

## Deployment

The project is deployed on the Vercel platform.

```bash
bun run build
```
