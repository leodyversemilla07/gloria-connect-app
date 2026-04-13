import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth_helpers";

// Query to fetch all businesses
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("businesses").collect();
  },
});

// Public browse query: only active businesses, storage-filtered by index
export const getPublic = query({
  args: {},
  handler: async (ctx) => {
    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_status", (q) => q.eq("metadata.status", "active"))
      .order("desc")
      .collect();

    return businesses.map((business) => {
      const primaryPhoto =
        business.photos?.find((photo) => photo.isPrimary) ?? business.photos?.[0] ?? null;

      return {
        _id: business._id,
        name: business.name,
        description: business.description,
        categoryPrimary: business.category.primary,
        barangay: business.address.barangay,
        phone: business.contact.phone,
        operatingHours: business.operatingHours,
        primaryPhoto: primaryPhoto
          ? {
              url: primaryPhoto.url,
              alt: primaryPhoto.alt,
            }
          : null,
      };
    });
  },
});

// Query to fetch a single business by _id
export const getById = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutation to update a business by id
export const update = mutation({
  args: {
    id: v.id("businesses"),
    businessId: v.optional(v.string()),
    name: v.object({
      english: v.string(),
      tagalog: v.string(),
    }),
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
    description: v.object({
      english: v.string(),
      tagalog: v.string(),
    }),
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
      lastUpdated: v.optional(v.string()),
      isVerified: v.boolean(),
      status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
      target: v.optional(v.string()),
      limit: v.optional(v.string()),
      reviewer: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Require admin access for business updates
    await requireAdmin(ctx);

    // Always update lastUpdated to now
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      businessId: args.businessId,
      name: args.name,
      category: args.category,
      contact: args.contact,
      address: args.address,
      description: args.description,
      operatingHours: args.operatingHours,
      photos: args.photos,
      metadata: {
        ...args.metadata,
        lastUpdated: now,
      },
    });
    return { success: true };
  },
});

// Mutation to create a new business
export const create = mutation({
  args: {
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
      isVerified: v.boolean(),
      status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
      target: v.optional(v.string()),
      limit: v.optional(v.string()),
      reviewer: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Require admin access for business creation
    await requireAdmin(ctx);

    // Set dateAdded and lastUpdated to now
    const now = new Date().toISOString();
    await ctx.db.insert("businesses", {
      businessId: args.businessId,
      name: args.name,
      category: args.category,
      contact: args.contact,
      address: args.address,
      description: args.description,
      operatingHours: args.operatingHours,
      photos: args.photos,
      metadata: {
        ...args.metadata,
        dateAdded: now,
        lastUpdated: now,
      },
    });
    return { success: true };
  },
});

export const remove = mutation({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const business = await ctx.db.get(args.id);
    if (!business) {
      throw new Error("Business not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Mutation to update business status only
export const updateStatus = mutation({
  args: {
    id: v.id("businesses"),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const business = await ctx.db.get(args.id);
    if (!business) {
      throw new Error("Business not found");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      metadata: {
        ...business.metadata,
        status: args.status,
        lastUpdated: now,
      },
    });
    return { success: true, status: args.status };
  },
});

// Mutation to toggle business verified status
export const toggleVerified = mutation({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const business = await ctx.db.get(args.id);
    if (!business) {
      throw new Error("Business not found");
    }

    const now = new Date().toISOString();
    const newVerified = !business.metadata?.isVerified;
    await ctx.db.patch(args.id, {
      metadata: {
        ...business.metadata,
        isVerified: newVerified,
        lastUpdated: now,
      },
    });
    return { success: true, isVerified: newVerified };
  },
});

// Mutation to set reviewer notes
export const setReviewer = mutation({
  args: {
    id: v.id("businesses"),
    reviewer: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const business = await ctx.db.get(args.id);
    if (!business) {
      throw new Error("Business not found");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      metadata: {
        ...business.metadata,
        reviewer: args.reviewer,
        lastUpdated: now,
      },
    });
    return { success: true };
  },
});
