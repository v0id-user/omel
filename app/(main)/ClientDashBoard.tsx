'use client';

import { DashboardSidebar } from '@/components/dashboard';
import { useUserInfoStore } from '@/store/persist/userInfo';
import { useRouter } from 'next/navigation';
export default function ClientDashBoard() {
  const userInfo = useUserInfoStore();
  const info = userInfo.getUserInfo();

  const router = useRouter();

  if (!info || !info.organizationInfo?.companyInfo?.name) {
    router.push('/clock-in');
    return <></>;
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
