import { internalMutation } from "./_generated/server";

export const cleanupAuth = internalMutation({
  handler: async (ctx) => {
    const results: Record<string, number> = {};

    const tables = [
      "users",
      "authAccounts",
      "authSessions",
      "authVerificationCodes",
      "authRefreshTokens",
    ] as const;

    for (const table of tables) {
      switch (table) {
        case "users": {
          const docs = await ctx.db.query("users").collect();
          for (const doc of docs) {
            await ctx.db.delete(doc._id);
          }
          results[table] = docs.length;
          break;
        }
        case "authAccounts": {
          const docs = await ctx.db.query("authAccounts").collect();
          for (const doc of docs) {
            await ctx.db.delete(doc._id);
          }
          results[table] = docs.length;
          break;
        }
        case "authSessions": {
          const docs = await ctx.db.query("authSessions").collect();
          for (const doc of docs) {
            await ctx.db.delete(doc._id);
          }
          results[table] = docs.length;
          break;
        }
        case "authVerificationCodes": {
          const docs = await ctx.db.query("authVerificationCodes").collect();
          for (const doc of docs) {
            await ctx.db.delete(doc._id);
          }
          results[table] = docs.length;
          break;
        }
        case "authRefreshTokens": {
          const docs = await ctx.db.query("authRefreshTokens").collect();
          for (const doc of docs) {
            await ctx.db.delete(doc._id);
          }
          results[table] = docs.length;
          break;
        }
      }
    }

    return results;
  },
});

export const createPasswordAdmin = internalMutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.db.insert("users", {
      email: "admin@gloria.connect",
      name: "Admin",
      isAdmin: true,
    });
    return { userId, email: "admin@gloria.connect" };
  },
});
