'use client';
import * as React from 'react';
import { BookOpenIcon, ListIcon, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { NavMain } from './nav-main';
const userNavItems = [
    {
        title: "Dashboard",
        url: "/user",
        icon: BookOpenIcon,
    },
    {
        title: "Vehicles",
        url: "/user/vehicles",
        icon: ListIcon,
    },
    {
        title: "Requests",
        url: "/user/requests",
        icon: ListIcon,
    },
];
export function UserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/user">
                <User className="h-5 w-5" />
                <span className="text-base font-semibold">User Portal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={userNavItems} quickActionLabel="Create new request" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: 'User',
            email: 'user@example.com',
            avatar: '/avatars/user.jpg',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}




















