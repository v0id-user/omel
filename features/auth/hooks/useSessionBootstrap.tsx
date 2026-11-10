'use client';

import { authClient } from '@/lib/betterauth/auth-client';
import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserInfoStore } from '@/store/persist/userInfo';

const ERROR_COUNT_KEY = 'auth_error_count';
const MAX_ERROR_COUNT = 3;

function handleAuthError() {
  const currentCount = parseInt(localStorage.getItem(ERROR_COUNT_KEY) || '0');
  const newCount = currentCount + 1;
  localStorage.setItem(ERROR_COUNT_KEY, newCount.toString());
  return newCount >= MAX_ERROR_COUNT;
}

export function clearAuthErrorCount() {
  localStorage.removeItem(ERROR_COUNT_KEY);
}

export function useSessionBootstrap() {
  const router = useRouter();
  const isBootstrappingRef = useRef(false);
  const hasBootstrappedRef = useRef(false);
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
      return;
    }

    if (hasBootstrappedRef.current) {
      return;
    }

    if (mySession === null || mySessionError) {
      authClient.signOut().then(() => {
        clearAuthErrorCount();
        router.push('/sign-in');
      });
      return;
    }

    if (myOrganizationError) {
      if (handleAuthError()) {
        signOutAndRedirect();
      }
      return;
    }

    if (!myOrganizationIsPending && myOrganization?.length && mySession?.user) {
      const activeOrg =
        myOrganization.find(org => org.id === mySession.session.activeOrganizationId) ??
        myOrganization[0];

      const finalizeBootstrap = () => {
        if (!mySession?.user) {
          if (handleAuthError()) {
            signOutAndRedirect();
          }
          return;
        }

        hasBootstrappedRef.current = true;
        clearAuthErrorCount();
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
        router.push('/dashboard');
      };

      if (mySession.session.activeOrganizationId === activeOrg.id) {
        finalizeBootstrap();
        return;
      }

      if (isBootstrappingRef.current) {
        return;
      }

      isBootstrappingRef.current = true;

      authClient.organization
        .setActive({
          organizationId: activeOrg.id,
        })
        .then(() => {
          isBootstrappingRef.current = false;
          finalizeBootstrap();
        })
        .catch(() => {
          isBootstrappingRef.current = false;
          if (handleAuthError()) {
            signOutAndRedirect();
          }
        });
    } else if (!myOrganizationIsPending && !myOrganization?.length) {
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
