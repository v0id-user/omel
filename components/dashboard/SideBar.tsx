import { Home, Settings, UserPlus, Bell, Shield, HelpCircle, UserCog } from 'lucide-react';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

// Main menu items
const mainItems = [
  {
    title: 'لوحة التحكم',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'العملاء',
    url: '/dashboard/customers',
    icon: UserPlus,
  },
];

// Settings menu items
const settingsItems = [
  {
    title: 'الإعدادات العامة',
    url: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'إعدادات المستخدم',
    url: '/dashboard/settings/user',
    icon: UserCog,
  },
  {
    title: 'الإشعارات',
    url: '/dashboard/settings/notifications',
    icon: Bell,
  },
  {
    title: 'الأمان',
    url: '/dashboard/settings/security',
    icon: Shield,
  },
  {
    title: 'المساعدة',
    url: '/help',
    icon: HelpCircle,
  },
];

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-end">أوميل</div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>الإعدادات</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
