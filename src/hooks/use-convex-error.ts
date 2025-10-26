import { ConvexError } from "convex/values";
import { toast } from "sonner";

/**
 * Handle Convex errors and display user-friendly messages
 */
export function handleConvexError(error: unknown, customMessage?: string) {
  if (error instanceof ConvexError) {
    const message = error.message;

    // Handle specific error types
    if (message.includes("Authentication required")) {
      toast.error("Please log in to continue");
    } else if (message.includes("Admin access required")) {
      toast.error("You don't have permission to perform this action");
    } else if (message.includes("not found")) {
      toast.error("The requested item was not found");
    } else {
      toast.error(customMessage || message);
    }
  } else {
    toast.error(customMessage || "An unexpected error occurred");
  }

  console.error("Convex error:", error);
}

/**
 * Check if an error is an authorization error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ConvexError) {
    return error.message.includes("Authentication required") ||
           error.message.includes("Admin access required");
  }
  return false;
}