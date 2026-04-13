import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireAdmin } from "../lib/auth";
import {
  businessStatusValidator,
  createBusinessArgs,
  updateBusinessArgs,
} from "./validators";

export const update = mutation({
  args: updateBusinessArgs,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

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

export const create = mutation({
  args: createBusinessArgs,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

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

export const updateStatus = mutation({
  args: {
    id: v.id("businesses"),
    status: businessStatusValidator,
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
