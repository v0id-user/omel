import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MoreVerticalIcon,
  UserCircleIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
} from 'lucide-react';

const menuItems = {
  الحساب: [
    { icon: UserCircleIcon, label: 'الحساب' },
    { icon: CreditCardIcon, label: 'الفواتير' },
    { icon: BellIcon, label: 'الإشعارات' },
  ],
  الخروج: [{ icon: LogOutIcon, label: 'تسجيل الخروج' }],
};

interface SideNavFooterProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function SideNavFooter({ user }: SideNavFooterProps) {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user.avatar} alt="المستخدم" />
                  <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-right text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
                <MoreVerticalIcon className="mr-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="right"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-right text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt="المستخدم" />
                    <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-right text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(menuItems).map(([groupLabel, items]) => (
                <div key={groupLabel}>
                  <DropdownMenuGroup dir="rtl">
                    {items.map(({ icon: Icon, label }) => (
                      <DropdownMenuItem key={label} className="cursor-pointer">
                        <Icon />
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  {groupLabel !== 'الخروج' && <DropdownMenuSeparator />}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
