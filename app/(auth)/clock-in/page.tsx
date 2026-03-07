'use client';

// TODO: This is a foundation to later choose multiple organizations

import { Suspense } from 'react';
import { useRouterEvents } from '@/lib/hooks/useRouterEvents';
import { Spinner } from '@/components/omel/Spinner';
import { useSessionBootstrap } from '@/features/auth/hooks/useSessionBootstrap';

// Component that uses useRouterEvents
function RouterEventsHandler({ onRouteChange }: { onRouteChange: () => void }) {
  useRouterEvents(onRouteChange);
  return null;
}

export default function ClockInPage() {
  const { handleRouteChange } = useSessionBootstrap();

  // Wrap the component using useSearchParams in Suspense
  const routerEventsHandler = (
    <Suspense fallback={null}>
      <RouterEventsHandler onRouteChange={handleRouteChange} />
    </Suspense>
  );

  return (
    <>
      {routerEventsHandler}
      <Spinner />
    </>
  );
}
