"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutList,
  LogOut,
  Settings,
  Ticket,
  Users,
} from "lucide-react";

import { logoutAction } from "@/actions/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/", label: "Hôm nay", icon: CalendarDays, exact: true },
  { href: "/customers", label: "Khách hàng", icon: Users, exact: false },
  { href: "/pipeline", label: "Lead & pipeline", icon: LayoutList, exact: false },
  { href: "/tickets", label: "Ticket", icon: Ticket, exact: false },
] as const;

const footerNavItems = [
  { href: "/settings", label: "Cài đặt", icon: Settings, exact: false },
] as const;

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavMenu({
  items,
}: {
  items: typeof mainNavItems | typeof footerNavItems;
}) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const active = isActive(pathname, item.href, item.exact);

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={active}
              className={cn(active && "bg-muted text-foreground")}
              render={<Link href={item.href} />}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-border">
      <SidebarHeader className="border-b border-border px-4 py-4">
        <span className="text-label font-medium text-foreground">BmadCRMMini</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <NavMenu items={mainNavItems} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border">
        <SidebarGroup>
          <SidebarGroupContent>
            <NavMenu items={footerNavItems} />
            <SidebarMenu>
              <SidebarMenuItem>
                <form action={logoutAction}>
                  <SidebarMenuButton
                    type="submit"
                    className="w-full text-muted-foreground"
                  >
                    <LogOut />
                    <span>Đăng xuất</span>
                  </SidebarMenuButton>
                </form>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
