import { Metadata } from 'next';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar, DashboardBreadcrumb } from '@/components/dashboard';

export const metadata: Metadata = {
  title: 'أوميل - لوحة التحكم',
  description: 'لوحة التحكم الرئيسية الخاصة بتطبيق أوميل  --  لإدارة علاقات الزبائن',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar variant="inset" />
      <SidebarTrigger />
      <SidebarInset>
        <div className="flex h-screen">
          <main className="flex-1 overflow-y-auto p-4">
            <DashboardBreadcrumb />
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
