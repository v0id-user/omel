'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Slash } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  const labelMap: Record<string, string> = {
    dashboard: 'لوحة التحكم',
    tasks: 'المهام',
    clients: 'العملاء',
    deals: 'الصفقات',
    activities: 'الأنشطة',
    team: 'الفريق',
    settings: 'الإعدادات',
  };

  // If we're just at the dashboard root, show simplified breadcrumb
  if (paths.length === 1 && paths[0] === 'dashboard') {
    return (
      <Breadcrumb>
        {/* TODO: Make this correct | Sidebar + Breadcrumb */}
        <BreadcrumbList>
          <BreadcrumbItem>
            <SidebarTrigger variant="ghost" className="text-black" />
          </BreadcrumbItem>
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <BreadcrumbItem>
            <BreadcrumbPage>لوحة التحكم</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash className="mx-1 h-3 w-3" />
          </BreadcrumbSeparator>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <SidebarTrigger variant="ghost" className="text-black" />
        </BreadcrumbItem>
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">لوحة التحكم</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {paths.length > 1 &&
          paths.slice(1).map((path, index) => {
            const href = `/${paths.slice(0, index + 2).join('/')}`;
            const isLast = index === paths.length - 2;
            const key = `${path}-${index}`;

            return (
              <React.Fragment key={key}>
                <BreadcrumbSeparator>
                  <Slash className="mx-1 h-3 w-3" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>
                      {labelMap[path] || (paths[index] === 'clients' ? 'ملف العميل' : path)}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{labelMap[path] || path}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
