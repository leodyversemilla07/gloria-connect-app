"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
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

  const navMain = [
    ...(isAdmin ? [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Businesses",
        url: "/admin/businesses",
        icon: IconDatabase,
      },
      {
        title: "Categories",
        url: "/admin/categories",
        icon: IconListDetails,
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        icon: IconChartBar,
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: IconUsers,
      },
      {
        title: "Reports",
        url: "/admin/reports",
        icon: IconReport,
      },
    ] : []),
  ];

  const navSecondary = [
    {
      title: "Settings",
      url: "/admin/dashboard", // Redirect to admin dashboard since settings page doesn't exist
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "/about", // Redirect to about page
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/business", // Redirect to business search
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
              <Link href="/">
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
