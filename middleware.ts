import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";
import { detectLanguage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "./src/i18n/routing";

const isProtectedRoute = createRouteMatcher([
  "/admin/:path*",
  "/dashboard/:path*",
  "/app/(admin)/:path*",
  "/app/(admin)/dashboard/:path*",
]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // Language detection from URL
  const { nextUrl } = request;
  const pathname = nextUrl?.pathname || request.url;
  const lang = detectLanguage(pathname);

  // Optionally: set cookie or context for language
  // Example: request.cookies.set('lang', lang);

  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, `/${lang}/login`);
  }
  // Optionally: redirect to language-prefixed route if missing
  if (!SUPPORTED_LANGUAGES.some(l => pathname.startsWith(`/${l}/`))) {
    return nextjsMiddlewareRedirect(request, `/${lang}${pathname}`);
  }
  return undefined; // Continue as normal
});

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/app/(admin)/:path*',
    '/app/(admin)/dashboard/:path*',
  ],
};