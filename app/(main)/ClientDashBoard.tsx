'use client';

import { DashboardSidebar } from '@/components/dashboard';
import { authClient } from '@/lib/betterauth/auth-client';
import { useRouter } from 'next/navigation';
export default function ClientDashBoard() {
  const org = authClient.useActiveOrganization();
  const session = authClient.useSession();
  const router = useRouter();
  const Spinner = () => (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  if (org.isPending || session.isPending) {
    return <Spinner />;
  }
  if (!org.data || !session.data) {
    router.push('/clock-in');
    return <Spinner />;
  }

  return (
    <DashboardSidebar
      variant="inset"
      organizationName={org.data.name}
      user={{
        name: session.data.user.name,
        email: session.data.user.email,
        userId: session.data.user.id,
        avatar: session.data.user.image || '',
      }}
    />
  );
}
