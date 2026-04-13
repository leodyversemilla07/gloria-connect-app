import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

const SUPPORTED_LANGUAGES = ["en", "fil"];
const DEFAULT_LANGUAGE = "en";
const PUBLIC_FILE = /\.[^/]+$/;

const isAuthRoute = createRouteMatcher(["/(.*)/(auth)/:path*", "/(.*)/login", "/(.*)/register"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (isAuthRoute(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/en");
  }

  if (pathname === "/" || pathname === "") {
    return NextResponse.redirect(new URL(`/${DEFAULT_LANGUAGE}`, request.url));
  }

  const [, maybeLocale] = pathname.split("/");
  const hasLanguagePrefix = SUPPORTED_LANGUAGES.includes(maybeLocale);

  if (!hasLanguagePrefix) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LANGUAGE}${pathname}`, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
