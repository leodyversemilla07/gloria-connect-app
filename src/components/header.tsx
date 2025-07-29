import Logo from "@/components/logo";
import LanguageToggle from "@/components/language-toggle";
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
}

export default function Header({ language, messages, setLanguage }: HeaderProps) {
  return (
    <header className="bg-card shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-4 md:py-0 gap-4 md:gap-0">
          <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-start">
            <Logo size={40} link="/" className="hidden lg:inline-block" />
            <h1 className="text-xl font-bold text-foreground">Gloria Local Connect</h1>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-end">
            <LanguageToggle language={language} setLanguage={setLanguage} />
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/">{messages["home"] || (language === "en" ? "Home" : "Tahanan")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/business">{messages["allBusinesses"] || (language === "en" ? "All Businesses" : "Lahat ng Negosyo")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/about">{messages["about"] || (language === "en" ? "About" : "Tungkol")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {/* TODO: Add authentication navigation (Login/Register/Dashboard) when user and loading state are available */}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
