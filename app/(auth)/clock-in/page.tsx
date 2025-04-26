'use client';

// TODO: This is a foundation to later choose multiple organizations

import { authClient } from '@/lib/betterauth/auth-client';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useRouterEvents } from '@/lib/hooks/useRouterEvents';
import { useUserInfoStore } from '@/store/persist/userInfo';

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
  const mySession = authClient.useSession();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
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

    if (!myOrganization.isPending && myOrganization.data?.length && mySession.data?.user) {
      // Set first organization as active
      const activeOrg = myOrganization.data[0];
      authClient.organization
        .setActive({
          organizationId: activeOrg.id,
        })
        .then(() => {
          if (!mySession.data?.user) {
            const shouldSignOut = handleAuthError();
            if (shouldSignOut) {
              // If error threshold reached, log out and redirect
              authClient.signOut().then(() => {
                router.push('/sign-in');
              });
            }
            return;
          }

          // Save data to local store
          setUserInfo({
            userId: mySession.data.user.id,
            email: mySession.data.user.email,
            personalInfo: {
              firstName: mySession.data.user.name?.split(' ')[0] || '',
              lastName: mySession.data.user.name?.split(' ').slice(1).join(' ') || '',
              phone: mySession.data.user.phoneNumber || '',
            },
            companyInfo: {
              name: activeOrg.name,
              // TODO: Add other company info as needed
            },
            organizationInfo: {
              companyInfo: {
                name: activeOrg.name,
                // TODO: Add other company info if available in metadata
              },
              slug: activeOrg.slug,
              id: activeOrg.id,
            },
          });
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
  }, [
    myOrganization.isPending,
    myOrganization.data,
    myOrganization.error,
    router,
    mySession.data,
    setUserInfo,
  ]);

  const Spinner = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  return <Spinner />;
}
