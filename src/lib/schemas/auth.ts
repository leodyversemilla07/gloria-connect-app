/**
 * Authentication schemas
 * Used for login, registration, and user profile validation
 */
import { z } from "zod";

// ============================================================================
// Base Field Schemas
// ============================================================================

/** Email validation schema */
export const emailSchema = z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address");

/**
 * Strong password validation schema
 * Requirements: 8+ chars, one digit, one lowercase, one uppercase
 * Matches backend validation in convex/auth.ts
 */
export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter");

/** Simple password for login (less strict, backend handles validation) */
export const loginPasswordSchema = z
    .string()
    .min(1, "Password is required");

/** User name validation schema */
export const nameSchema = z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters");

// ============================================================================
// Form Schemas
// ============================================================================

/** Login form validation schema */
export const loginSchema = z.object({
    email: emailSchema,
    password: loginPasswordSchema,
});

/** Registration form validation schema */
export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
});

// ============================================================================
// Type Exports
// ============================================================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
