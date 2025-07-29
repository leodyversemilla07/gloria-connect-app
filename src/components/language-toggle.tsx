"use client";

// No local state needed
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fil", label: "Filipino" }
];

export default function LanguageToggle({ language, setLanguage }: { language: string; setLanguage: (lang: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="language-select">Language:</Label>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger id="language-select" className="min-w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>{lang.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
