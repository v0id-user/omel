import { ArrowUpCircleIcon } from 'lucide-react';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// // Main menu items
// const mainItems = [
//   {
//     title: 'لوحة التحكم',
//     url: '/dashboard',
//     icon: Home,
//   },
//   {
//     title: 'العملاء',
//     url: '/dashboard/customers',
//     icon: UserPlus,
//   },
// ];

// // Settings menu items
// const settingsItems = [
//   {
//     title: 'الإعدادات العامة',
//     url: '/dashboard/settings',
//     icon: Settings,
//   },
//   {
//     title: 'إعدادات المستخدم',
//     url: '/dashboard/settings/user',
//     icon: UserCog,
//   },
//   {
//     title: 'الإشعارات',
//     url: '/dashboard/settings/notifications',
//     icon: Bell,
//   },
//   {
//     title: 'الأمان',
//     url: '/dashboard/settings/security',
//     icon: Shield,
//   },
//   {
//     title: 'المساعدة',
//     url: '/help',
//     icon: HelpCircle,
//   },
// ];

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>TODO:</SidebarGroup>
      </SidebarContent>
      <SidebarFooter>USER</SidebarFooter>
    </Sidebar>
  );
}
