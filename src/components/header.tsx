import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LanguageToggle from "@/components/language-toggle";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  language: string;
  messages: Record<string, string>;
  setLanguage: (lang: string) => void;
  user?: { name?: string; avatarUrl?: string } | null;
  currentPath?: string;
}

export default function Header({
  language,
  messages,
  setLanguage,
  user,
  currentPath,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: `/${language}`,
      active: "/",
      label: messages.home || (language === "en" ? "Home" : "Tahanan"),
    },
    {
      href: `/${language}/business`,
      active: "/business",
      label: messages.allBusinesses || (language === "en" ? "All Businesses" : "Lahat ng Negosyo"),
    },
    {
      href: `/${language}/about`,
      active: "/about",
      label: messages.about || (language === "en" ? "About" : "Tungkol"),
    },
  ];

  return (
    <header className="bg-card/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${language}`} className="flex items-center gap-2 group">
            <Logo size={36} className="group-hover:scale-105 transition-transform" />
            <span className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary hidden xs:inline">
              Gloria Local Connect
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.active}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPath === link.active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <LanguageToggle language={language} setLanguage={setLanguage} />
              <ThemeToggle />
              {user ? (
                <Button
                  render={<Link href={`/${language}/dashboard`}>{messages.dashboard || "Dashboard"}</Link>}
                  size="sm"
                />
              ) : (
                <>
                  <Link
                    href={`/${language}/login`}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      currentPath === "/login" ? "text-primary" : ""
                    }`}
                  >
                    {messages.login || (language === "en" ? "Login" : "Mag-login")}
                  </Link>
                  <Button
                    render={
                      <Link href={`/${language}/register`}>
                        {messages.register || (language === "en" ? "Register" : "Magrehistro")}
                      </Link>
                    }
                    nativeButton={false}
                    size="sm"
                  />
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.active}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium py-2 px-4 rounded-lg transition-colors ${
                    currentPath === link.active ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 px-4 py-2">
                <LanguageToggle language={language} setLanguage={setLanguage} />
                <ThemeToggle />
              </div>
              <div className="flex gap-2 px-4">
                {user ? (
                  <Button
                    render={
                      <Link href={`/${language}/dashboard`} onClick={() => setMobileMenuOpen(false)}>
                        {messages.dashboard || "Dashboard"}
                      </Link>
                    }
                    className="flex-1"
                  />
                ) : (
                  <>
                    <Button
                      render={
                        <Link href={`/${language}/login`} onClick={() => setMobileMenuOpen(false)}>
                          {messages.login || "Login"}
                        </Link>
                      }
                      variant="outline"
                      className="flex-1"
                    />
                    <Button
                      render={
                        <Link href={`/${language}/register`} onClick={() => setMobileMenuOpen(false)}>
                          {messages.register || "Register"}
                        </Link>
                      }
                      className="flex-1"
                    />
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
