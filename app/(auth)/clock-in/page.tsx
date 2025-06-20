'use client';

// TODO: This is a foundation to later choose multiple organizations

import { authClient } from '@/lib/betterauth/auth-client';
import { useEffect, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useRouterEvents } from '@/lib/hooks/useRouterEvents';
import { useUserInfoStore } from '@/store/persist/userInfo';
import { Spinner } from '@/components/omel/Spinner';
import { log } from '@/utils/logs';

const ERROR_COUNT_KEY = 'auth_error_count';
const MAX_ERROR_COUNT = 3;

function handleAuthError() {
  console.log(
    log({
      component: 'clock-in',
      message: 'Handling auth error',
      data: { currentCount: parseInt(localStorage.getItem(ERROR_COUNT_KEY) || '0') },
    })
  );
  const currentCount = parseInt(localStorage.getItem(ERROR_COUNT_KEY) || '0');
  const newCount = currentCount + 1;
  localStorage.setItem(ERROR_COUNT_KEY, newCount.toString());
  return newCount >= MAX_ERROR_COUNT;
}

function clearErrorCount() {
  console.log(
    log({
      component: 'clock-in',
      message: 'Clearing error count',
    })
  );
  localStorage.removeItem(ERROR_COUNT_KEY);
}

// Component that uses useRouterEvents
function RouterEventsHandler({ onRouteChange }: { onRouteChange: () => void }) {
  useRouterEvents(onRouteChange);
  return null;
}

export default function ClockInPage() {
  const router = useRouter();
  const {
    data: myOrganization,
    error: myOrganizationError,
    isPending: myOrganizationIsPending,
  } = authClient.useListOrganizations();
  const {
    data: mySession,
    error: mySessionError,
    isPending: mySessionIsPending,
  } = authClient.useSession();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const handleRouteChange = useCallback(() => {
    clearErrorCount();
  }, []);

  // Wrap the component using useSearchParams in Suspense
  const routerEventsHandler = (
    <Suspense fallback={null}>
      <RouterEventsHandler onRouteChange={handleRouteChange} />
    </Suspense>
  );

  useEffect(() => {
    if (myOrganizationIsPending || mySessionIsPending) {
      console.log(
        log({
          component: 'clock-in',
          message: 'Organization or session is pending',
        })
      );
      return;
    }

    if (mySession === null || mySessionError) {
      console.log(
        log({
          component: 'clock-in',
          message: 'Session is null or there is an error',
        })
      );
      // Redirect immediately if session is null or there is an error
      authClient.signOut().then(() => {
        clearErrorCount();

        router.push('/sign-in');
      });
    }

    if (myOrganizationError) {
      console.log(
        log({
          component: 'clock-in',
          message: 'Organization error',
        })
      );
      const shouldSignOut = handleAuthError();
      if (shouldSignOut) {
        console.log(
          log({
            component: 'clock-in',
            message: 'Organization error, logging out',
          })
        );
        // If error threshold reached, log out and redirect
        authClient.signOut().then(() => {
          router.push('/sign-in');
        });
      }
      return;
    }

    if (!myOrganizationIsPending && myOrganization?.length && mySession?.user) {
      console.log(
        log({
          component: 'clock-in',
          message: 'Setting active organization',
          data: { organizationId: myOrganization[0].id, organizationName: myOrganization[0].name },
        })
      );
      // Set first organization as active
      const activeOrg = myOrganization[0];
      authClient.organization
        .setActive({
          organizationId: activeOrg.id,
        })
        .then(() => {
          if (!mySession?.user) {
            console.log(
              log({
                component: 'clock-in',
                message: 'Session user is null after setting active organization',
              })
            );
            const shouldSignOut = handleAuthError();
            if (shouldSignOut) {
              // If error threshold reached, log out and redirect
              authClient.signOut().then(() => {
                router.push('/sign-in');
              });
            }
            return;
          }

          console.log(
            log({
              component: 'clock-in',
              message: 'Saving user info to local store',
              data: { userId: mySession.user.id, email: mySession.user.email },
            })
          );
          // Save data to local store
          setUserInfo({
            userId: mySession.user.id,
            email: mySession.user.email,
            personalInfo: {
              firstName: mySession.user.name?.split(' ')[0] || '',
              lastName: mySession.user.name?.split(' ').slice(1).join(' ') || '',
              phone: mySession.user.phoneNumber || '',
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
          console.log(
            log({
              component: 'clock-in',
              message: 'Redirecting to dashboard',
            })
          );
          router.push('/dashboard');
        })
        .catch(() => {
          console.log(
            log({
              component: 'clock-in',
              message: 'Error setting active organization',
              level: 'error',
            })
          );
          const shouldSignOut = handleAuthError();
          if (shouldSignOut) {
            // If error threshold reached, log out and redirect
            authClient.signOut().then(() => {
              router.push('/sign-in');
            });
          }
        });
    } else if (!myOrganizationIsPending && !myOrganization?.length) {
      console.log(
        log({
          component: 'clock-in',
          message: 'No organizations found',
        })
      );
      const shouldSignOut = handleAuthError();
      if (shouldSignOut) {
        // If error threshold reached, log out and redirect
        authClient.signOut().then(() => {
          router.push('/sign-in');
        });
      }
    }
  }, [
    // Organization
    myOrganizationIsPending,
    myOrganizationError,
    myOrganization,

    // Session
    mySessionError,
    mySessionIsPending,
    mySession,

    router,
    setUserInfo,
  ]);

  return (
    <>
      {routerEventsHandler}
      <Spinner />
    </>
  );
}
