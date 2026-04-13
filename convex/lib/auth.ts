import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";
import { getUserByEmail } from "../users/shared";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

type Ctx = QueryCtx | MutationCtx;

export async function requireAdmin(ctx: Ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Authentication required");
  }

  const email = identity.email;
  if (!email) {
    throw new ConvexError("Email required for authorization");
  }

  const user = await getUserByEmail(ctx, email);
  if (!user) {
    throw new ConvexError("User not found");
  }

  if (!user.isAdmin) {
    throw new ConvexError("Admin access required");
  }

  return user as Doc<"users">;
}

export async function requireAuth(ctx: Ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Authentication required");
  }
  return identity;
}

export async function getCurrentUserRole(ctx: Ctx): Promise<UserRole | null> {
  try {
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) {
      return null;
    }

    const user = await getUserByEmail(ctx, email);
    return user?.isAdmin ? UserRole.ADMIN : UserRole.USER;
  } catch {
    return null;
  }
}

export async function requireRole(ctx: Ctx, requiredRole: UserRole) {
  const userRole = await getCurrentUserRole(ctx);
  if (userRole !== requiredRole) {
    throw new ConvexError(`${requiredRole} access required`);
  }
}
