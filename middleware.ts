import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/admin/:path*",
  "/dashboard/:path*",
  "/app/(admin)/:path*",
  "/app/(admin)/dashboard/:path*",
]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/login");
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