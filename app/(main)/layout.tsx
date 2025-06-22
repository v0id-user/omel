import { Metadata } from 'next';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from '@/components/dashboard';
import { HydrateClient } from '@/trpc/server';
import ClientDashBoard from './ClientDashBoard';

export const metadata: Metadata = {
  title: 'أوميل - لوحة التحكم',
  description: 'لوحة التحكم الرئيسية الخاصة بتطبيق أوميل  --  لإدارة علاقات الزبائن',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ClientDashBoard />
      <SidebarInset>
        <main className="flex-1 overflow-y-auto">
          <DashboardBreadcrumb />
          <HydrateClient>{children}</HydrateClient>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
