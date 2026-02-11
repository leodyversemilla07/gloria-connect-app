import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "../convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Authentication - Gloria Connect",
    description: "Login and registration for Gloria Local Connect",
};


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <ConvexClientProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                    <div className="flex w-full max-w-sm md:max-w-4xl flex-col gap-6">
                        {children}
                    </div>
                </div>
            </ThemeProvider>
        </ConvexClientProvider>
    );
}
