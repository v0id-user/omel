import React from 'react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { SideNavMain } from './sidebar-navs/nav-main';
import { SideNavHeader } from './sidebar-navs/nav-header';

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  organizationName: string;
  user: {
    name: string;
    email: string;
    avatar: string;
    userId: string;
  };
  footer?: React.ReactNode;
}

export function DashboardSidebar({
  organizationName,
  user,
  footer,
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" className="text-muted-foreground" {...props}>
      {/* Sidebar Header */}
      <SideNavHeader organizationName={organizationName} />

      {/* Main Menu */}
      <SidebarContent>
        <SideNavMain />
      </SidebarContent>

      {/* User Dropdown Menu */}
      {footer}
    </Sidebar>
  );
}
