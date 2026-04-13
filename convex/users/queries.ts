import { query } from "../_generated/server";
import { getAdminStatusByIdentity, getUserByEmail } from "./shared";

export const getIsAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await getAdminStatusByIdentity(ctx);
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity();
  },
});

export const getEmailVerificationStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) {
      return { isVerified: false };
    }

    const user = await getUserByEmail(ctx, identity.email);
    return {
      isVerified: !!user?.emailVerificationTime,
      email: identity.email,
    };
  },
});
