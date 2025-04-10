'use client';
import { authClient } from '@/lib/betterauth/auth-client';

export default function MyOrg() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  return <div>{activeOrganization ? <p>{activeOrganization.name}</p> : null}</div>;
}
