import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth_helpers";
import { sendVerificationEmail } from "./emailVerification";

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

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity();
  },
});

export const sendVerificationCode = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    await ctx.db.insert("authVerificationCodes", {
      userId: user._id,
      code,
      expiresAt,
      email: args.email,
      type: "email_verification",
    });

    await sendVerificationEmail(args.email, code);
    return { success: true };
  },
});

export const verifyEmailCode = mutation({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const verificationCode = await ctx.db
      .query("authVerificationCodes")
      .withIndex("code", (q) => q.eq("code", args.code))
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!verificationCode) {
      throw new Error("Invalid verification code");
    }

    if (verificationCode.expiresAt && verificationCode.expiresAt < Date.now()) {
      throw new Error("Verification code expired");
    }

    await ctx.db.patch(user._id, {
      emailVerificationTime: Date.now(),
    });

    await ctx.db.delete(verificationCode._id);

    return { success: true };
  },
});

export const getEmailVerificationStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return { isVerified: false };
    
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .first();
    
    return { 
      isVerified: !!user?.emailVerificationTime,
      email: identity.email 
    };
  },
});

export const setAdminStatus = mutation({
  args: {
    email: v.string(),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, { isAdmin: args.isAdmin });
    return { success: true };
  },
});