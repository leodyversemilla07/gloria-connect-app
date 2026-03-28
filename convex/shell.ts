import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seedAdminUser = internalMutation({
  args: { email: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { isAdmin: true });
      return { message: "Updated existing user to admin", userId: existing._id };
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      isAdmin: true,
    });

    return { message: "Created admin user", userId };
  },
});
