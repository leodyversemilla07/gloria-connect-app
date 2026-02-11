import Logo from "@/components/logo";
import LanguageToggle from "@/components/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";

interface HeaderProps {
  language: string;
  messages: Record<string, string>;
  setLanguage: (lang: string) => void;
  user?: { name?: string; avatarUrl?: string } | null;
  currentPath?: string;
}

export default function Header({ language, messages, setLanguage, user, currentPath }: HeaderProps) {
  return (
    <header className="bg-card shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-4 md:py-0 gap-4 md:gap-0">
          <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-start">
            <Link href="/" className="flex items-center space-x-2 group">
              <Logo size={40} className="hidden lg:inline-block group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold text-foreground group-hover:text-primary">Gloria Local Connect</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-end">
            <LanguageToggle language={language} setLanguage={setLanguage} />
            <ThemeToggle />
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className={currentPath === "/" ? "text-primary font-bold" : ""}>{messages["home"] || (language === "en" ? "Home" : "Tahanan")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/business" className={currentPath === "/business" ? "text-primary font-bold" : ""}>{messages["allBusinesses"] || (language === "en" ? "All Businesses" : "Lahat ng Negosyo")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/about" className={currentPath === "/about" ? "text-primary font-bold" : ""}>{messages["about"] || (language === "en" ? "About" : "Tungkol")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <div className="mx-2 border-l h-6 self-center" />
                {/* Auth links visually separated */}
                {user ? (
                  <NavigationMenuItem>
                    <Button asChild variant="default" size="sm">
                      <Link href="/admin/dashboard">
                        {messages["dashboard"] || (language === "en" ? "Dashboard" : "Dashboard")}
                      </Link>
                    </Button>
                  </NavigationMenuItem>
                ) : (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link href="/login" className={currentPath === "/login" ? "text-primary font-bold" : "font-semibold text-primary"}>{messages["login"] || (language === "en" ? "Login" : "Mag-login")}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link href="/register" className={currentPath === "/register" ? "text-primary font-bold" : "font-semibold text-primary"}>{messages["register"] || (language === "en" ? "Register" : "Magrehistro")}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
