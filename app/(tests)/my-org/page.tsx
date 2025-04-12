'use client';
import { authClient } from '@/lib/betterauth/auth-client';
import { useRouter } from 'next/navigation';

export default function MyOrg() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const router = useRouter();
  if (process.env.NEXT_PUBLIC_ENV !== 'dev') {
    router.push('/');
  }
  return <div>{activeOrganization ? <p>{activeOrganization.name}</p> : null}</div>;
}
