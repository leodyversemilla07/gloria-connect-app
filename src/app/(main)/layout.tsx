import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Lora } from "next/font/google";
import "../globals.css";
import { ConvexClientProvider } from "../convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "./i18n-provider";
import enMessages from "../../../messages/en.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Gloria Local Connect | Discover Local Businesses",
  description: "Discover the best local businesses in Gloria, Oriental Mindoro. Find restaurants, shops, services, and more in your community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = "en";
  const messages = enMessages;

  return (
    <ConvexClientProvider>
      <I18nProvider language={language} messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${lora.variable} min-h-screen bg-background font-[family-name:var(--font-lora)]`}>
            {children}
          </div>
        </ThemeProvider>
      </I18nProvider>
    </ConvexClientProvider>
  );
}
