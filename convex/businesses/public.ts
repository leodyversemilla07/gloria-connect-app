import { v } from "convex/values";
import { query } from "../_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("businesses").collect();
  },
});

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

export const getById = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
