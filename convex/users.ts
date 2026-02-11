import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth_helpers";

// Query to get the current user's isAdmin status
export const getIsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { isAdmin: false };
    if (!identity.email) return { isAdmin: false };
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .first();
    return { isAdmin: !!user?.isAdmin };
  },
});

// Query to get the current user's identity
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity(); // null if not authenticated, otherwise user info
  },
});

// Mutation to set admin status for a user by email (requires admin access)
export const setAdminStatus = mutation({
  args: {
    email: v.string(),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Only admins can modify admin status
    await requireAdmin(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q: any) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, { isAdmin: args.isAdmin });
    return { success: true };
  },
});