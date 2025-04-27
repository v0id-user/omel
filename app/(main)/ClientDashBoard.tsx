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
    return null;
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
