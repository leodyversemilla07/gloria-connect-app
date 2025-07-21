import { query } from "./_generated/server";

// Query to get the current user's isAdmin status
export const getIsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { isAdmin: false };
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .first();
    return { isAdmin: !!user?.isAdmin };
  },
});
