import { ConvexClientProvider } from "@/app/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "../../i18n-provider";
import enMessages from "../../../../../messages/en.json";
import filMessages from "../../../../../messages/fil.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication - Gloria Connect",
    description: "Login and registration for Gloria Local Connect",
};

type AuthLayoutProps = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function LocaleAuthLayout({ 
    children, 
    params 
}: AuthLayoutProps) {
    const { locale } = await params;
    const validLocale = ['en', 'fil'].includes(locale) ? locale : 'en';
    const messages = validLocale === 'fil' ? filMessages : enMessages;

    return (
        <I18nProvider language={validLocale} messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                    <div className="flex w-full max-w-sm md:max-w-4xl flex-col gap-6">
                        {children}
                    </div>
                </div>
            </ThemeProvider>
        </I18nProvider>
    );
}
