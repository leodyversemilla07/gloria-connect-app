import { ConvexError } from "convex/values";

/**
 * Authorization utilities for role-based access control
 */

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

/**
 * Check if a user has admin privileges
 * @param ctx - Convex context
 * @throws ConvexError if user is not authenticated or not an admin
 * @returns The user document if authorized
 */
export async function requireAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Authentication required");
  }

  if (!identity.email) {
    throw new ConvexError("Email required for authorization");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("email", (q: any) => q.eq("email", identity.email))
    .first();

  if (!user) {
    throw new ConvexError("User not found");
  }

  if (!user.isAdmin) {
    throw new ConvexError("Admin access required");
  }

  return user;
}

/**
 * Check if a user is authenticated
 * @param ctx - Convex context
 * @throws ConvexError if user is not authenticated
 * @returns The user identity
 */
export async function requireAuth(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Authentication required");
  }
  return identity;
}

/**
 * Get the current user's role
 * @param ctx - Convex context
 * @returns UserRole or null if not authenticated
 */
export async function getCurrentUserRole(ctx: any): Promise<UserRole | null> {
  try {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q: any) => q.eq("email", identity.email))
      .first();

    return user?.isAdmin ? UserRole.ADMIN : UserRole.USER;
  } catch {
    return null;
  }
}

/**
 * Check if current user has a specific role
 * @param ctx - Convex context
 * @param requiredRole - The required role
 * @throws ConvexError if user doesn't have the required role
 */
export async function requireRole(ctx: any, requiredRole: UserRole) {
  const userRole = await getCurrentUserRole(ctx);
  if (userRole !== requiredRole) {
    throw new ConvexError(`${requiredRole} access required`);
  }
}