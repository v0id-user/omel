'use client';

import { ArrowUpCircleIcon, MailIcon, PlusCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SidebarMenu,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function CompanyName() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 text-gray-600">
          <Link href="/dashboard" prefetch={true}>
            <ArrowUpCircleIcon className="h-5 w-5" />
            <span className="text-base font-semibold">شركة أكمي</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function QuickAction() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2">
        <SidebarMenuButton
          tooltip="إنشاء مهمة"
          className="min-w-8 cursor-pointer bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
        >
          <PlusCircleIcon />
          <span>إنشاء سريع</span>
        </SidebarMenuButton>
        <Button
          size="icon"
          className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
          variant="outline"
        >
          <MailIcon />
          <span className="sr-only">البريد الوارد</span>
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function SideNavHeader() {
  return (
    <SidebarHeader>
      <CompanyName />
      <QuickAction />
    </SidebarHeader>
  );
}
