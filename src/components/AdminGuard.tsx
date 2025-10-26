"use client";

import { useQuery } from "convex/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Higher-order component that protects admin routes
 * Requires user to be authenticated and have admin role
 */
export function AdminGuard({
  children,
  fallback,
  redirectTo = "/"
}: AdminGuardProps) {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);

  // Safely get auth token with error handling
  let token;
  try {
    token = useAuthToken();
  } catch (error) {
    console.error("AdminGuard: Failed to get auth token", error);
    setHasError(true);
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                  Authentication Error
                </h3>
                <p className="text-muted-foreground mt-2">
                  Unable to verify authentication status.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = token === undefined;
  const isAuthenticated = !!token;

  // Safely get admin status with error handling
  let adminQueryResult;
  let isAdmin;
  try {
    adminQueryResult = useQuery(api.users.getIsAdmin, {});
    isAdmin = adminQueryResult?.isAdmin;
  } catch (error) {
    console.error("AdminGuard: Failed to get admin status", error);
    setHasError(true);
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                  Authorization Error
                </h3>
                <p className="text-muted-foreground mt-2">
                  Unable to verify admin permissions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin === false) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthenticated, isAdmin, router, redirectTo]);

  // Show loading state
  if (isLoading || !isAuthenticated || isAdmin === undefined) {
    return fallback || (
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
    );
  }

  // Show unauthorized message
  if (isAdmin === false) {
    return fallback || (
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
                  You don't have permission to access this page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}