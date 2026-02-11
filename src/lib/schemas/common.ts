/**
 * Common utility schemas and helpers
 * Shared across auth and business schemas
 */
import { z } from "zod";

// ============================================================================
// URL & Contact Schemas
// ============================================================================

/** Optional URL with proper format validation */
export const urlSchema = z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal(""));

/** Optional email with proper format validation */
export const optionalEmailSchema = z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal(""));

// ============================================================================
// Error Formatting Utilities
// ============================================================================

/**
 * Format Zod validation errors into user-friendly strings
 * Works with TanStack Form error format
 */
export function formatZodErrors(
    errors: unknown[] | undefined
): string {
    if (!errors || errors.length === 0) return "";

    return errors
        .map((err) => {
            if (typeof err === "string") return err;
            if (err && typeof err === "object" && "message" in err) {
                return (err as { message: string }).message;
            }
            return "Invalid input";
        })
        .join(", ");
}

/**
 * Extract first error message from Zod parse result
 */
export function getFirstError(result: { success: boolean; error?: { issues: Array<{ message: string }> } }): string | null {
    if (result.success) return null;
    const firstIssue = result.error?.issues[0];
    return firstIssue?.message || "Validation failed";
}

// ============================================================================
// Type Utilities
// ============================================================================

/** Infer the input type from a Zod schema */
export type SchemaInput<T extends z.ZodTypeAny> = z.input<T>;

/** Infer the output type from a Zod schema */
export type SchemaOutput<T extends z.ZodTypeAny> = z.output<T>;
