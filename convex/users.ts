import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { MutationCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireAuth } from "./auth_helpers";

const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;
const SEND_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const VERIFY_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const SEND_LIMIT_MAX_ATTEMPTS = 3;
const VERIFY_LIMIT_MAX_ATTEMPTS = 5;

async function enforceRateLimit(
  ctx: MutationCtx,
  identifier: string,
  windowMs: number,
  maxAttempts: number,
) {
  const now = Date.now();
  const existing = await ctx.db
    .query("authRateLimits")
    .withIndex("identifier", (q) => q.eq("identifier", identifier))
    .first();

  if (!existing || now - existing.windowStart >= windowMs) {
    if (existing) {
      await ctx.db.patch(existing._id, {
        count: 1,
        windowStart: now,
      });
    } else {
      await ctx.db.insert("authRateLimits", {
        identifier,
        count: 1,
        windowStart: now,
      });
    }
    return;
  }

  if (existing.count >= maxAttempts) {
    throw new ConvexError("Too many attempts. Please try again later.");
  }

  await ctx.db.patch(existing._id, { count: existing.count + 1 });
}

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
    const identity = await requireAuth(ctx);
    const email = identity.email;
    if (!email || email !== args.email) {
      throw new ConvexError("You can only verify your own email address.");
    }

    await enforceRateLimit(
      ctx,
      `send-email-verification:${email}`,
      SEND_LIMIT_WINDOW_MS,
      SEND_LIMIT_MAX_ATTEMPTS,
    );

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      return { success: true };
    }

    if (user.emailVerificationTime) {
      return { success: true };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + VERIFICATION_CODE_TTL_MS;

    const existingCodes = await ctx.db
      .query("authVerificationCodes")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const existingCode of existingCodes) {
      if (existingCode.type === "email_verification") {
        await ctx.db.delete(existingCode._id);
      }
    }

    await ctx.db.insert("authVerificationCodes", {
      userId: user._id,
      code,
      expiresAt,
      email: args.email,
      type: "email_verification",
    });

    await ctx.scheduler.runAfter(0, internal.emailVerification.deliverVerificationEmail, {
      email: args.email,
      code,
    });

    return { success: true };
  },
});

export const verifyEmailCode = mutation({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const email = identity.email;
    if (!email || email !== args.email) {
      throw new ConvexError("You can only verify your own email address.");
    }

    await enforceRateLimit(
      ctx,
      `verify-email-code:${email}`,
      VERIFY_LIMIT_WINDOW_MS,
      VERIFY_LIMIT_MAX_ATTEMPTS,
    );

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new ConvexError("Invalid verification code.");
    }

    const verificationCode = await ctx.db
      .query("authVerificationCodes")
      .withIndex("by_email_and_code", (q) => q.eq("email", args.email).eq("code", args.code))
      .unique();

    if (!verificationCode) {
      throw new ConvexError("Invalid verification code.");
    }

    if (verificationCode.expiresAt && verificationCode.expiresAt < Date.now()) {
      await ctx.db.delete(verificationCode._id);
      throw new ConvexError("Verification code expired.");
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
      email: identity.email,
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
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, { isAdmin: args.isAdmin });
    return { success: true };
  },
});
