// import {
//   CalendarIcon,
//   CheckSquare2,
//   MessageSquareIcon,
//   SettingsIcon,
//   StickyNoteIcon,
//   UsersIcon,
//   LayoutDashboardIcon
// } from 'lucide-react';

import {
  ViewStructureUp,
  Community,
  MultiplePagesEmpty,
  Notes,
  Message,
  Calendar,
  Group,
  Settings,
} from 'iconoir-react';

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
    { href: '/dashboard', icon: ViewStructureUp, label: 'لوحة التحكم' },
    { href: '/dashboard/clients', icon: Community, label: 'العملاء' },
    { href: '/dashboard/tasks', icon: MultiplePagesEmpty, label: 'المهام' },
  ],
  التواصل: [
    { href: '/dashboard/notes', icon: Notes, label: 'الملاحظات' },
    { href: '/dashboard/messages', icon: Message, label: 'الرسائل' },
    { href: '/dashboard/calendar', icon: Calendar, label: 'التقويم' },
  ],
  'مساحة العمل': [
    { href: '/dashboard/team', icon: Group, label: 'الفريق' },
    { href: '/dashboard/settings', icon: Settings, label: 'الإعدادات' },
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
