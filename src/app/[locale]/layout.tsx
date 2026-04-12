import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Lora } from "next/font/google";
import "../globals.css";
import { ConvexClientProvider } from "../convex-client-provider";
import { I18nProvider } from "@/components/i18n-provider";
import enMessages from "../../../messages/en.json";
import filMessages from "../../../messages/fil.json";

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

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Gloria Connect",
  description: "A modern local business directory application.",
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fil" }];
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale, fallback to 'en'
  const validLocale = ["en", "fil"].includes(locale) ? locale : "en";
  const messages = validLocale === "fil" ? filMessages : enMessages;

  return (
    <ConvexClientProvider>
      <I18nProvider key={validLocale} language={validLocale} messages={messages}>
        <div
          className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${lora.variable} min-h-screen bg-background font-[family-name:var(--font-lora)]`}
        >
          {children}
        </div>
      </I18nProvider>
    </ConvexClientProvider>
  );
}
