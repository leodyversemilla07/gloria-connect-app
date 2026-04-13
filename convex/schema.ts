import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authRateLimits: defineTable({
    identifier: v.string(),
    count: v.number(),
    windowStart: v.number(),
  }).index("identifier", ["identifier"]),

  authAccounts: defineTable({
    provider: v.string(),
    providerAccountId: v.string(),
    secret: v.optional(v.string()),
    userId: v.id("users"),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    tokenType: v.optional(v.string()),
    scope: v.optional(v.string()),
    idToken: v.optional(v.string()),
    sessionState: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
  }).index("providerAndAccountId", ["provider", "providerAccountId"]),

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    isAdmin: v.optional(v.boolean()),
  }).index("email", ["email"]),

  authSessions: defineTable({
    userId: v.id("users"),
    expirationTime: v.number(),
  }).index("userId", ["userId"]),

  authVerificationCodes: defineTable({
    accountId: v.optional(v.id("authAccounts")),
    userId: v.optional(v.id("users")),
    code: v.string(),
    expiresAt: v.optional(v.float64()),
    emailVerified: v.optional(v.string()),
    provider: v.optional(v.string()),
    expirationTime: v.optional(v.float64()),
    consumed: v.optional(v.boolean()),
    type: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  })
    .index("accountId", ["accountId"])
    .index("by_email_and_code", ["email", "code"])
    .index("code", ["code"])
    .index("userId", ["userId"]),

  authRefreshTokens: defineTable({
    sessionId: v.id("authSessions"),
    parentRefreshTokenId: v.optional(v.id("authRefreshTokens")),
    userId: v.optional(v.id("users")),
    expiresAt: v.optional(v.float64()),
    expirationTime: v.optional(v.float64()),
    firstUsedTime: v.optional(v.float64()),
    consumed: v.optional(v.boolean()),
  })
    .index("sessionIdAndParentRefreshTokenId", ["sessionId", "parentRefreshTokenId"])
    .index("sessionId", ["sessionId"]),

  businesses: defineTable({
    businessId: v.optional(v.string()),
    name: v.union(
      v.string(),
      v.object({
        english: v.string(),
        tagalog: v.string(),
      }),
    ),
    category: v.object({
      primary: v.string(),
      secondary: v.optional(v.array(v.string())),
    }),
    contact: v.object({
      phone: v.string(),
      email: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    address: v.object({
      street: v.string(),
      barangay: v.string(),
      coordinates: v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
    }),
    description: v.union(
      v.string(),
      v.object({
        english: v.string(),
        tagalog: v.string(),
      }),
    ),
    operatingHours: v.object({
      monday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
      tuesday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
      wednesday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
      thursday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
      friday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
      saturday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
      sunday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
    }),
    photos: v.optional(
      v.array(
        v.object({
          url: v.string(),
          storageId: v.optional(v.id("_storage")),
          alt: v.string(),
          isPrimary: v.boolean(),
        }),
      ),
    ),
    metadata: v.object({
      dateAdded: v.string(),
      lastUpdated: v.string(),
      isVerified: v.boolean(),
      status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
      target: v.optional(v.string()),
      limit: v.optional(v.string()),
      reviewer: v.optional(v.string()),
    }),
  }).index("by_status", ["metadata.status"]),
});
