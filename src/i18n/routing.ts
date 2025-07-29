export const SUPPORTED_LANGUAGES = ["en", "fil"];
export const DEFAULT_LANGUAGE = "en";

export function detectLanguage(pathname: string): string {
  // Example: /fil/dashboard, /en/dashboard
  const lang = pathname.split("/")[1];
  if (SUPPORTED_LANGUAGES.includes(lang)) {
    return lang;
  }
  return DEFAULT_LANGUAGE;
}
