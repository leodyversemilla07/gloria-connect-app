"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useCallback } from "react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fil", label: "Filipino", flag: "🇵🇭" }
];

interface LanguageToggleProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export default function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      if (newLanguage === language) return;

      // Remove current language prefix from pathname
      let newPathname = pathname;
      const currentLocaleMatch = pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(\/|$)/);
      
      if (currentLocaleMatch) {
        newPathname = pathname.slice(currentLocaleMatch[0].length - 1) || "/";
      }

      // Add new language prefix and navigate
      const targetPath = `/${newLanguage}${newPathname === "/" ? "" : newPathname}`;
      setLanguage(newLanguage);
      router.push(targetPath);
    },
    [pathname, language, setLanguage, router]
  );

  const getOtherLanguage = () => {
    return language === "en" ? "fil" : "en";
  };

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const otherLangObj = LANGUAGES.find(l => l.code === getOtherLanguage()) || LANGUAGES[1];

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLanguageChange(getOtherLanguage())}
        className="flex items-center gap-2 text-xs sm:text-sm font-medium hover:bg-accent"
        title={`Switch to ${otherLangObj.label}`}
        aria-label={`Switch language to ${otherLangObj.label}`}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLangObj.label}</span>
        <span className="sm:hidden">{currentLangObj.flag}</span>
      </Button>
    </div>
  );
}
