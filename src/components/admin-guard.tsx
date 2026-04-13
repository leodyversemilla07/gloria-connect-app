"use client";

import { useAuthToken } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { AlertCircle, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { authPath, localeRoute } from "@/lib/locale-paths";
import { api } from "../../convex/_generated/api";

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Higher-order component that protects admin routes
 * Requires user to be authenticated and have admin role
 */
export function AdminGuard({ children, fallback, redirectTo }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const token = useAuthToken();
  const isLoading = token === undefined;
  const isAuthenticated = !!token;

  const adminQueryResult = useQuery(api.users.getIsAdmin, {});
  const isAdmin = adminQueryResult?.isAdmin;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(authPath(pathname, "/login"));
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin === false) {
      router.replace(redirectTo ?? localeRoute(pathname, "/"));
    }
  }, [isLoading, isAuthenticated, isAdmin, router, redirectTo, pathname]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Verifying session...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Redirecting to login...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  if (isAdmin === undefined) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Verifying admin access...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  if (isAdmin === false) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                    Access Denied
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    You don&apos;t have permission to access this page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  return <>{children}</>;
}
