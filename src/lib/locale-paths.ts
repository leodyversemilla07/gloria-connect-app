export type SupportedLocale = "en" | "fil";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["en", "fil"];
export const DEFAULT_LOCALE: SupportedLocale = "en";

export function localeFromPath(pathname: string): SupportedLocale {
  const maybe = pathname.split("/")[1] as SupportedLocale | undefined;
  return SUPPORTED_LOCALES.includes(maybe as SupportedLocale)
    ? (maybe as SupportedLocale)
    : DEFAULT_LOCALE;
}

export function localeRoute(pathname: string, route: string): string {
  const locale = localeFromPath(pathname);
  const normalized = route.startsWith("/") ? route : `/${route}`;
  return `/${locale}${normalized}`;
}

export function adminPath(pathname: string, route: string = "/dashboard"): string {
  return localeRoute(pathname, route);
}

export function authPath(pathname: string, route: string = "/login"): string {
  return localeRoute(pathname, route);
}
