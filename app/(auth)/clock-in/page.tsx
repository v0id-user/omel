'use client';

import { authClient } from '@/lib/betterauth/auth-client';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useRouterEvents } from '@/lib/hooks/useRouterEvents';

const ERROR_COUNT_KEY = 'auth_error_count';
const MAX_ERROR_COUNT = 3;

function handleAuthError() {
  const currentCount = parseInt(localStorage.getItem(ERROR_COUNT_KEY) || '0');
  const newCount = currentCount + 1;
  localStorage.setItem(ERROR_COUNT_KEY, newCount.toString());
  return newCount >= MAX_ERROR_COUNT;
}

function clearErrorCount() {
  localStorage.removeItem(ERROR_COUNT_KEY);
}

export default function ClockInPage() {
  const router = useRouter();
  const myOrganization = authClient.useListOrganizations();

  const handleRouteChange = useCallback(() => {
    clearErrorCount();
  }, []);

  useRouterEvents(handleRouteChange);

  useEffect(() => {
    if (myOrganization.error) {
      const shouldSignOut = handleAuthError();
      if (shouldSignOut) {
        // If error threshold reached, log out and redirect
        authClient.signOut().then(() => {
          router.push('/sign-in');
        });
      }
      return;
    }

    if (!myOrganization.isPending && myOrganization.data?.length) {
      // Set first organization as active
      authClient.organization
        .setActive({
          organizationId: myOrganization.data[0].id,
        })
        .then(() => {
          router.push('/dashboard');
        })
        .catch(() => {
          const shouldSignOut = handleAuthError();
          if (shouldSignOut) {
            // If error threshold reached, log out and redirect
            authClient.signOut().then(() => {
              router.push('/sign-in');
            });
          }
        });
    } else if (!myOrganization.isPending && !myOrganization.data?.length) {
      const shouldSignOut = handleAuthError();
      if (shouldSignOut) {
        // If error threshold reached, log out and redirect
        authClient.signOut().then(() => {
          router.push('/sign-in');
        });
      }
    }
  }, [myOrganization.isPending, myOrganization.data, myOrganization.error, router]);

  const Spinner = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  return <Spinner />;
}
