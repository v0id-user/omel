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
    { href: '/dashboard/clients', icon: UsersIcon, label: 'العملاء' },
    { href: '/dashboard/tasks', icon: CheckSquareIcon, label: 'المهام' },
  ],
  التواصل: [
    { href: '/dashboard/notes', icon: StickyNoteIcon, label: 'الملاحظات' },
    { href: '/dashboard/messages', icon: MessageSquareIcon, label: 'الرسائل' },
    { href: '/dashboard/calendar', icon: CalendarIcon, label: 'التقويم' },
  ],
  'مساحة العمل': [
    { href: '/dashboard/team', icon: UsersIcon, label: 'الفريق' },
    { href: '/dashboard/settings', icon: SettingsIcon, label: 'الإعدادات' },
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
