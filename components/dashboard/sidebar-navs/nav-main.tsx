'use client';
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
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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
  const pathname = usePathname();

  return (
    <>
      {Object.entries(menuItems).map(([groupLabel, items]) => (
        <SidebarGroup key={groupLabel}>
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <SidebarMenu>
            {items.map(({ href, icon: Icon, label }) => {
              const isActive =
                href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === href || pathname.startsWith(`${href}/`);

              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(isActive && 'bg-accent text-accent-foreground font-medium')}
                  >
                    <Link href={href} prefetch={true}>
                      <Icon className={cn(isActive && 'text-primary')} />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
