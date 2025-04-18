import {
  CalendarIcon,
  CheckSquareIcon,
  MessageSquareIcon,
  SettingsIcon,
  StickyNoteIcon,
  UsersIcon,
} from 'lucide-react';
import { LayoutDashboardIcon } from 'lucide-react';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import Link from 'next/link';

const menuItems = {
  'نظام إدارة العملاء': [
    { href: '/dashboard', icon: LayoutDashboardIcon, label: 'لوحة التحكم' },
    { href: '/clients', icon: UsersIcon, label: 'العملاء' },
    { href: '/tasks', icon: CheckSquareIcon, label: 'المهام' },
  ],
  التواصل: [
    { href: '/notes', icon: StickyNoteIcon, label: 'الملاحظات' },
    { href: '/messages', icon: MessageSquareIcon, label: 'الرسائل' },
    { href: '/calendar', icon: CalendarIcon, label: 'التقويم' },
  ],
  'مساحة العمل': [
    { href: '/team', icon: UsersIcon, label: 'الفريق' },
    { href: '/settings', icon: SettingsIcon, label: 'الإعدادات' },
  ],
};

export function SideNavMain() {
  return (
    <>
      {Object.entries(menuItems).map(([groupLabel, items]) => (
        <SidebarGroup key={groupLabel}>
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <SidebarMenu>
            {items.map(({ href, icon: Icon, label }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild>
                  <Link href={href} prefetch={true}>
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
