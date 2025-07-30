import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { z } from "zod";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google,
    Password({
      profile(params) {
        // Zod validation for email and name (updated for deprecation)
        const ProfileSchema = z.object({
          email: z.email(),
          name: z.string().min(1).max(100).optional(),
        });
        const result = ProfileSchema.safeParse(params);
        if (!result.success) {
          throw new ConvexError(z.treeifyError(result.error));
        }
        const profile: { email: string; name?: string } = { email: result.data.email };
        if (result.data.name) profile.name = result.data.name;
        return profile;
      },
      validatePasswordRequirements(password: string) {
        // Require at least 8 chars, one digit, one lowercase, one uppercase
        if (
          password.length < 8 ||
          !/\d/.test(password) ||
          !/[a-z]/.test(password) ||
          !/[A-Z]/.test(password)
        ) {
          throw new ConvexError("Password must be at least 8 characters and include a digit, lowercase, and uppercase letter.");
        }
      },
    }),
  ],
});

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
