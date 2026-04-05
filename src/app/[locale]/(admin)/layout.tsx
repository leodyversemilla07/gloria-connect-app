import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminGuard } from "@/components/admin-guard";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard - Gloria Connect",
  description: "Admin dashboard for Gloria Local Connect business directory",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customStyle: Record<string, string> = {
    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)",
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider style={customStyle as React.CSSProperties}>
        <AppSidebar variant="inset" collapsible="icon" />
        <SidebarInset>
          <div className={`${geistSans.variable} ${geistMono.variable}`}>
            <SiteHeader />
          </div>
          <div className="flex flex-1 flex-col">
            <div
              className={`@container/main flex flex-1 flex-col gap-2 ${geistSans.variable} ${geistMono.variable}`}
            >
              <AdminGuard>{children}</AdminGuard>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
