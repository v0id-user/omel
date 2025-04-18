import React from 'react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { SideNavMain } from './sidebar-navs/nav-main';
import { SideNavFooter } from './sidebar-navs/nav-footer';
import { SideNavHeader } from './sidebar-navs/nav-header';

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" className="text-muted-foreground" {...props}>
      {/* Sidebar Header */}
      <SideNavHeader />

      {/* Main Menu */}
      <SidebarContent>
        <SideNavMain />
      </SidebarContent>

      {/* User Dropdown Menu */}
      <SideNavFooter />
    </Sidebar>
  );
}
