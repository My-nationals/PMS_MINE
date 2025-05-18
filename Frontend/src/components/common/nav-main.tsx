'use client';
import { PlusCircleIcon, MoveRight, type LucideIcon, Eye } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import SlotForm from './slot-form';
export function NavMain({
  items,
  quickActionLabel = 'Quick Create',
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
  quickActionLabel?: string;
}) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [open, setOpen] = useState(false);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {isAdminRoute ? (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <SidebarMenuButton
                    tooltip={quickActionLabel}
                    className="min-w-8 bg-slate-200 duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                  >
                    <PlusCircleIcon />
                    <span>{quickActionLabel}</span>
                  </SidebarMenuButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] px-[5%] py-10">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold">
                      Create New Slot
                    </DialogTitle>
                  </DialogHeader>
                  <SlotForm />
                  <DialogClose asChild>
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <MoveRight />
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <NavLink to="/user/slots" className="w-full">
                <SidebarMenuButton
                  tooltip={quickActionLabel}
                  className="w-full min-w-8 bg-slate-200 duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                >
                  <Eye />
                  <span>{quickActionLabel}</span>
                </SidebarMenuButton>
              </NavLink>
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <MoveRight />
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink
                to={item.url}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}












2








