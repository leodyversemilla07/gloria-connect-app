import { ConvexClientProvider } from "@/app/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminGuard } from "@/components/admin-guard";
import { I18nProvider } from "../../i18n-provider";
import enMessages from "../../../../../messages/en.json";
import filMessages from "../../../../../messages/fil.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard - Gloria Connect",
    description: "Admin dashboard for Gloria Local Connect business directory",
};

type AdminLayoutProps = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function LocaleAdminLayout({ 
    children, 
    params 
}: AdminLayoutProps) {
    const { locale } = await params;
    const validLocale = ['en', 'fil'].includes(locale) ? locale : 'en';
    const messages = validLocale === 'fil' ? filMessages : enMessages;

    const customStyle: Record<string, string> = {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
    };

    return (
        <I18nProvider language={validLocale} messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <SidebarProvider style={customStyle as React.CSSProperties}>
                    <AppSidebar variant="inset" collapsible="icon" />
                    <SidebarInset>
                        <SiteHeader />
                        <div className="flex flex-1 flex-col">
                            <div className="@container/main flex flex-1 flex-col gap-2">
                                <AdminGuard>
                                    {children}
                                </AdminGuard>
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </ThemeProvider>
        </I18nProvider>
    );
}
