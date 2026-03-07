import { internalMutation } from "./_generated/server";

export const createAdminUser = internalMutation({
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", "admin@gloria.connect"))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { isAdmin: true, name: "Admin" });
      return { message: "Made user admin", userId: existing._id };
    }

    const userId = await ctx.db.insert("users", {
      email: "admin@gloria.connect",
      name: "Admin",
      isAdmin: true,
    });

    return { message: "Created admin user", userId };
  },
});
