"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Logo from "./logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAdmin } = useQuery(api.users.getIsAdmin, {}) ?? { isAdmin: false };
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const navMain = [
    ...(isAdmin ? [
      {
        title: "Dashboard",
        url: `/${locale}/admin/dashboard`,
        icon: IconDashboard,
      },
      {
        title: "Businesses",
        url: `/${locale}/admin/businesses`,
        icon: IconDatabase,
      },
      {
        title: "Categories",
        url: `/${locale}/admin/categories`,
        icon: IconListDetails,
      },
      {
        title: "Analytics",
        url: `/${locale}/admin/analytics`,
        icon: IconChartBar,
      },
      {
        title: "Users",
        url: `/${locale}/admin/users`,
        icon: IconUsers,
      },
      {
        title: "Reports",
        url: `/${locale}/admin/reports`,
        icon: IconReport,
      },
    ] : []),
  ];

  const navSecondary = [
    {
      title: "Settings",
      url: `/${locale}/admin/dashboard`,
      icon: IconSettings,
    },
    {
      title: "Help",
      url: `/${locale}/about`,
      icon: IconHelp,
    },
    {
      title: "Search",
      url: `/${locale}/business`,
      icon: IconSearch,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={`/${locale}`}>
                <Logo className="!h-8 !w-8" />
                <span className="text-base font-semibold">Gloria Local Connect</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
