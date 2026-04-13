import { v } from "convex/values";

export const businessStatusValidator = v.union(
  v.literal("active"),
  v.literal("inactive"),
  v.literal("pending")
);

const localizedTextValidator = v.object({
  english: v.string(),
  tagalog: v.string(),
});

const businessCategoryValidator = v.object({
  primary: v.string(),
  secondary: v.optional(v.array(v.string())),
});

const businessContactValidator = v.object({
  phone: v.string(),
  email: v.optional(v.string()),
  website: v.optional(v.string()),
});

const businessCoordinatesValidator = v.object({
  latitude: v.number(),
  longitude: v.number(),
});

const businessAddressValidator = v.object({
  street: v.string(),
  barangay: v.string(),
  coordinates: businessCoordinatesValidator,
});

export const operatingHoursValidator = v.object({
  monday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
  tuesday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
  wednesday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
  thursday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
  friday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
  saturday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
  sunday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
});

export const businessPhotosValidator = v.optional(
  v.array(
    v.object({
      url: v.string(),
      storageId: v.optional(v.id("_storage")),
      alt: v.string(),
      isPrimary: v.boolean(),
    })
  )
);

const createMetadataValidator = v.object({
  isVerified: v.boolean(),
  status: businessStatusValidator,
  target: v.optional(v.string()),
  limit: v.optional(v.string()),
  reviewer: v.optional(v.string()),
});

const updateMetadataValidator = v.object({
  dateAdded: v.string(),
  lastUpdated: v.optional(v.string()),
  isVerified: v.boolean(),
  status: businessStatusValidator,
  target: v.optional(v.string()),
  limit: v.optional(v.string()),
  reviewer: v.optional(v.string()),
});

export const createBusinessArgs = {
  businessId: v.optional(v.string()),
  name: v.union(v.string(), localizedTextValidator),
  category: businessCategoryValidator,
  contact: businessContactValidator,
  address: businessAddressValidator,
  description: v.union(v.string(), localizedTextValidator),
  operatingHours: operatingHoursValidator,
  photos: businessPhotosValidator,
  metadata: createMetadataValidator,
};

export const updateBusinessArgs = {
  id: v.id("businesses"),
  businessId: v.optional(v.string()),
  name: localizedTextValidator,
  category: businessCategoryValidator,
  contact: businessContactValidator,
  address: businessAddressValidator,
  description: localizedTextValidator,
  operatingHours: operatingHoursValidator,
  photos: businessPhotosValidator,
  metadata: updateMetadataValidator,
};
