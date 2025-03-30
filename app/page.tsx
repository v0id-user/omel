import { trpc, HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ClientGreeting } from '@/app/client-greeting';

export default async function Home() {
  // Prefetch the query for client
  void trpc.hello.prefetch({ text: 'Testing TRPC' });

  // Get data on the server test
  const data = await trpc.hello({ text: 'Testing TRPC' });
  return (
    <HydrateClient>
      <div>...</div>
      {/** ... */}
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <div>Data on server: {data.greeting}</div>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientGreeting />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
