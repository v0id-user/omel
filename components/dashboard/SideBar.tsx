'use client';

import {
  Home,
  Search,
  Settings,
  BarChart2,
  ClipboardList,
  ShoppingBag,
  MessageSquare,
  UserPlus,
  CalendarClock,
  PhoneCall,
  UserCog,
  Bell,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

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
  SidebarMenuSub,
  SidebarSeparator,
  useSidebar,
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
    subItems: [
      {
        title: 'قائمة العملاء',
        url: '/dashboard/customers/list',
      },
      {
        title: 'إضافة عميل',
        url: '/dashboard/customers/add',
      },
      {
        title: 'تقارير العملاء',
        url: '/dashboard/customers/reports',
      },
    ],
  },
  {
    title: 'المبيعات',
    url: '/dashboard/sales',
    icon: ShoppingBag,
    subItems: [
      {
        title: 'المبيعات الحالية',
        url: '/dashboard/sales/current',
      },
      {
        title: 'العروض',
        url: '/dashboard/sales/offers',
      },
      {
        title: 'الفواتير',
        url: '/dashboard/sales/invoices',
      },
    ],
  },
  {
    title: 'الاتصالات',
    url: '/dashboard/calls',
    icon: PhoneCall,
  },
  {
    title: 'المهام',
    url: '/dashboard/tasks',
    icon: ClipboardList,
  },
  {
    title: 'المواعيد',
    url: '/dashboard/appointments',
    icon: CalendarClock,
  },
  {
    title: 'الرسائل',
    url: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'التقارير',
    url: '/dashboard/reports',
    icon: BarChart2,
  },
  {
    title: 'البحث',
    url: '/dashboard/search',
    icon: Search,
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
    url: '/dashboard/help',
    icon: HelpCircle,
  },
];

export function DashboardSidebar() {
  const { isRtl } = useSidebar();
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

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
                  {item.subItems ? (
                    <SidebarMenuSub>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        <SidebarMenu>
                          {item.subItems.map(subItem => (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild>
                                <a href={subItem.url}>
                                  <ChevronIcon className="h-4 w-4 mx-2" />
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarMenuSub>
                    </SidebarMenuSub>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
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
