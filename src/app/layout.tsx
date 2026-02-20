import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { generateHrefLangLinks } from "@/utils/seo-metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gloria Local Connect",
  description: "Business directory for Gloria Local Connect - Connect with purpose",
  alternates: {
    languages: {
      en: 'https://gloria-connect.com/en',
      'fil-PH': 'https://gloria-connect.com/fil',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* hreflang tags for SEO multi-language support */}
        <link rel="alternate" hrefLang="en" href="https://gloria-connect.com/en" />
        <link rel="alternate" hrefLang="fil-PH" href="https://gloria-connect.com/fil" />
        <link rel="alternate" hrefLang="x-default" href="https://gloria-connect.com/en" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
