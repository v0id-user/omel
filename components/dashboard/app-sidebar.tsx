'use client';

import * as React from 'react';
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

import { NavDocuments } from '@/components/dashboard/nav-documents';
import { NavMain } from '@/components/dashboard/nav-main';
import { NavSecondary } from '@/components/dashboard/nav-secondary';
import { NavUser } from '@/components/dashboard/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'شادكن',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'لوحة التحكم',
      url: '#',
      icon: IconDashboard,
    },
    {
      title: 'دورة الحياة',
      url: '#',
      icon: IconListDetails,
    },
    {
      title: 'التحليلات',
      url: '#',
      icon: IconChartBar,
    },
    {
      title: 'المشاريع',
      url: '#',
      icon: IconFolder,
    },
    {
      title: 'الفريق',
      url: '#',
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: 'التقاط',
      icon: IconCamera,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'العروض النشطة',
          url: '#',
        },
        {
          title: 'الأرشيف',
          url: '#',
        },
      ],
    },
    {
      title: 'العرض',
      icon: IconFileDescription,
      url: '#',
      items: [
        {
          title: 'العروض النشطة',
          url: '#',
        },
        {
          title: 'الأرشيف',
          url: '#',
        },
      ],
    },
    {
      title: 'الإرشادات',
      icon: IconFileAi,
      url: '#',
      items: [
        {
          title: 'العروض النشطة',
          url: '#',
        },
        {
          title: 'الأرشيف',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'الإعدادات',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'الحصول على المساعدة',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'البحث',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'مكتبة البيانات',
      url: '#',
      icon: IconDatabase,
    },
    {
      name: 'التقارير',
      url: '#',
      icon: IconReport,
    },
    {
      name: 'مساعد الكلمات',
      url: '#',
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">أكمي إنك.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
