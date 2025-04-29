'use client';

import { DashboardSidebar } from '@/components/dashboard';
import { useUserInfoStore } from '@/store/persist/userInfo';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientDashBoard() {
  const [mounted, setMounted] = useState(false);
  const userInfo = useUserInfoStore();
  const info = userInfo.getUserInfo();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!info || !info.organizationInfo?.companyInfo?.name)) {
      router.push('/clock-in');
    }
  }, [mounted, info, router]);
  if (!mounted || !info || !info.organizationInfo?.companyInfo?.name) {
    return (
      <div className="fixed inset-0 bg-white z-9999 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardSidebar
      variant="inset"
      organizationName={info.organizationInfo.companyInfo.name}
      user={{
        name: `${info.personalInfo.firstName} ${info.personalInfo.lastName}`,
        email: info.email,
        userId: info.userId,
        avatar: '',
      }}
    />
  );
}
