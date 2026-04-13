import { mutation } from "../_generated/server";

export const migrateAuthRefreshTokens = mutation({
  args: {},
  handler: async (ctx) => {
    const tokens = await ctx.db.query("authRefreshTokens").collect();
    let updated = 0;
    let removed = 0;
    for (const token of tokens) {
      let needsUpdate = false;
      const update: Record<string, unknown> = {};
      if (token.expirationTime && !token.expiresAt) {
        update.expiresAt = token.expirationTime;
        needsUpdate = true;
      }
      if (!token.userId) {
        await ctx.db.delete(token._id);
        removed++;
        continue;
      }
      if (needsUpdate) {
        await ctx.db.patch(token._id, update);
        updated++;
      }
    }
    return { updated, removed };
  },
});
