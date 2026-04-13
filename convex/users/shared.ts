import type { MutationCtx, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

export async function getUserByEmail(ctx: Ctx, email: string) {
  return await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .first();
}

export async function getAdminStatusByIdentity(ctx: Ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.email) {
    return { isAdmin: false };
  }

  const user = await getUserByEmail(ctx, identity.email);
  return { isAdmin: !!user?.isAdmin };
}
