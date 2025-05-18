'use client';
import * as React from 'react';
import { ArrowUpCircleIcon, LayoutDashboardIcon, ListIcon, MailIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
const adminNavItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Requests',
    url: '/admin/requests',
    icon: MailIcon,
  },
  {
    title: 'Slots',
    url: '/admin/slots',
    icon: ListIcon,
  },
];
export function AdminSidebar({
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
              <Link to="/admin">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Admin Portal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminNavItems} quickActionLabel="Quick Create" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: 'Admin User',
            email: 'admin@example.com',
            avatar: '/avatars/admin.jpg',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}














