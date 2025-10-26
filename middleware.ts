import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/admin/:path*",
]);

// Define admin-only routes
const isAdminRoute = createRouteMatcher([
  "/admin/:path*",
]);

export const auth = convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // Check if user is authenticated for protected routes
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/auth/login");
  }

  // For admin routes, we rely on client-side checks since server-side role checking
  // with Convex would require additional database queries
  // The AdminGuard component handles the role-based access control

  return undefined; // Continue as normal
});

export default auth;

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};