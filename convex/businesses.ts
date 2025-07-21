import { query } from "./_generated/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Query to fetch all businesses
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("businesses").collect();
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
        name: v.object({ english: v.string(), tagalog: v.string() }),
        category: v.object({ primary: v.string(), secondary: v.array(v.string()) }),
        contact: v.object({ phone: v.string(), email: v.string(), website: v.string() }),
        address: v.object({
            street: v.string(),
            barangay: v.string(),
            coordinates: v.object({ latitude: v.number(), longitude: v.number() })
        }),
        description: v.object({ english: v.string(), tagalog: v.string() }),
        operatingHours: v.any(),
        photos: v.array(v.object({ url: v.string(), alt: v.string(), isPrimary: v.boolean() })),
        metadata: v.object({
            dateAdded: v.string(),
            lastUpdated: v.optional(v.string()),
            isVerified: v.boolean(),
            status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
        })
    },
    handler: async (ctx, args) => {
        // Always update lastUpdated to now
        const now = new Date().toISOString();
        await ctx.db.patch(args.id, {
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