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
import { authClient } from '@/lib/betterauth/auth-client';

const menuItems = {
  الحساب: [
    {
      icon: UserCircleIcon,
      label: 'الحساب',
      onClick: () => console.log('Navigate to account settings'),
    },
    { icon: CreditCardIcon, label: 'الفواتير', onClick: () => console.log('Navigate to billing') },
    { icon: BellIcon, label: 'الإشعارات', onClick: () => console.log('Navigate to notifications') },
  ],
  الخروج: [
    {
      icon: LogOutIcon,
      label: 'تسجيل الخروج',
      onClick: async () => {
        console.log('Handle logout');
        await authClient.signOut();
        window.location.href = '/sign-in';
      },
    },
  ],
};

interface SideNavFooterProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

const UserDropDown = ({ user }: SideNavFooterProps) => {
  return (
    <DropdownMenu modal={false}>
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
        collisionPadding={8}
        avoidCollisions
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
              {items.map(({ icon: Icon, label, onClick }) => (
                <DropdownMenuItem key={label} className="cursor-pointer" onClick={onClick}>
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
  );
};

export function SideNavFooter({ user }: SideNavFooterProps) {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <UserDropDown user={user} />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
