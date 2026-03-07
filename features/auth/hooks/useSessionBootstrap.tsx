'use client';

import { authClient } from '@/lib/betterauth/auth-client';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserInfoStore } from '@/store/persist/userInfo';
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

export function clearAuthErrorCount() {
  console.log(
    log({
      component: 'clock-in',
      message: 'Clearing error count',
    })
  );
  localStorage.removeItem(ERROR_COUNT_KEY);
}

export function useSessionBootstrap() {
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

  const signOutAndRedirect = useCallback(async () => {
    await authClient.signOut();
    router.push('/sign-in');
  }, [router]);

  const handleRouteChange = useCallback(() => {
    clearAuthErrorCount();
  }, []);

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
      authClient.signOut().then(() => {
        clearAuthErrorCount();
        router.push('/sign-in');
      });
      return;
    }

    if (myOrganizationError) {
      console.log(
        log({
          component: 'clock-in',
          message: 'Organization error',
        })
      );
      if (handleAuthError()) {
        console.log(
          log({
            component: 'clock-in',
            message: 'Organization error, logging out',
          })
        );
        signOutAndRedirect();
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
            if (handleAuthError()) {
              signOutAndRedirect();
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
            },
            organizationInfo: {
              companyInfo: {
                name: activeOrg.name,
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
          if (handleAuthError()) {
            signOutAndRedirect();
          }
        });
    } else if (!myOrganizationIsPending && !myOrganization?.length) {
      console.log(
        log({
          component: 'clock-in',
          message: 'No organizations found',
        })
      );
      if (handleAuthError()) {
        signOutAndRedirect();
      }
    }
  }, [
    myOrganizationIsPending,
    myOrganizationError,
    myOrganization,
    mySessionError,
    mySessionIsPending,
    mySession,
    router,
    setUserInfo,
    signOutAndRedirect,
  ]);

  return {
    handleRouteChange,
  };
}
