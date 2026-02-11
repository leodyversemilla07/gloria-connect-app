/**
 * Business-related schemas
 * Used for business creation, editing, and validation
 */
import { z } from "zod";

// ============================================================================
// Contact & Location Schemas
// ============================================================================

/** Philippine phone number format (flexible) */
export const phoneSchema = z
    .string()
    .min(1, "Phone number is required")
    .regex(
        /^(\+63|0)?[\s.-]?\d{3}[\s.-]?\d{3}[\s.-]?\d{4}$/,
        "Please enter a valid Philippine phone number"
    )
    .or(z.string().min(7, "Phone number must be at least 7 digits"));

/** Latitude validation (-90 to 90) */
export const latitudeSchema = z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90");

/** Longitude validation (-180 to 180) */
export const longitudeSchema = z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180");

/** GPS coordinates schema */
export const coordinatesSchema = z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
});

/** Contact information schema */
export const contactSchema = z.object({
    phone: phoneSchema,
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

/** Address schema with coordinates */
export const addressSchema = z.object({
    street: z.string().min(1, "Street address is required"),
    barangay: z.string().min(1, "Barangay is required"),
    coordinates: coordinatesSchema,
});

// ============================================================================
// Operating Hours Schemas
// ============================================================================

/** Single day operating hours */
export const dayHoursSchema = z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
});

/** Full week operating hours */
export const operatingHoursSchema = z.object({
    monday: dayHoursSchema,
    tuesday: dayHoursSchema,
    wednesday: dayHoursSchema,
    thursday: dayHoursSchema,
    friday: dayHoursSchema,
    saturday: dayHoursSchema,
    sunday: dayHoursSchema,
});

// ============================================================================
// Business Content Schemas
// ============================================================================

/** Business photo schema */
export const photoSchema = z.object({
    url: z.string().url("Please enter a valid image URL").or(z.literal("")),
    alt: z.string(),
    isPrimary: z.boolean(),
});

/** Bilingual name schema */
export const bilingualNameSchema = z.object({
    english: z.string().min(1, "English name is required"),
    tagalog: z.string().min(1, "Tagalog name is required"),
});

/** Bilingual description schema */
export const bilingualDescriptionSchema = z.object({
    english: z.string().min(10, "Description must be at least 10 characters"),
    tagalog: z.string().min(10, "Description must be at least 10 characters"),
});

/** Category schema */
export const categorySchema = z.object({
    primary: z.string().min(1, "Primary category is required"),
    secondary: z.array(z.string()).optional(),
});

/** Business metadata schema */
export const businessMetadataSchema = z.object({
    isVerified: z.boolean(),
    status: z.enum(["active", "inactive", "pending"]),
    target: z.string().optional(),
    limit: z.string().optional(),
    reviewer: z.string().optional(),
});

// ============================================================================
// Complete Business Schema
// ============================================================================

/** Full business schema (matches Convex schema) */
export const businessSchema = z.object({
    businessId: z.string().optional(),
    name: bilingualNameSchema,
    category: categorySchema,
    contact: contactSchema,
    address: addressSchema,
    description: bilingualDescriptionSchema,
    operatingHours: operatingHoursSchema,
    photos: z.array(photoSchema).optional(),
    metadata: businessMetadataSchema,
});

// ============================================================================
// Form-Specific Schemas (Flattened for form state)
// ============================================================================

/** Business form state schema (flattened structure for forms) */
export const businessFormSchema = z.object({
    nameEnglish: z.string().min(1, "English name is required"),
    nameTagalog: z.string().min(1, "Tagalog name is required"),
    categoryPrimary: z.string().min(1, "Primary category is required"),
    categorySecondary: z.array(z.string()),
    phone: z.string().min(7, "Phone number must be at least 7 digits"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    addressStreet: z.string().min(1, "Street address is required"),
    addressBarangay: z.string().min(1, "Barangay is required"),
    addressLatitude: z.string().refine(
        (val) => val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90),
        "Latitude must be between -90 and 90"
    ),
    addressLongitude: z.string().refine(
        (val) => val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180),
        "Longitude must be between -180 and 180"
    ),
    descriptionEnglish: z.string().min(10, "Description must be at least 10 characters"),
    descriptionTagalog: z.string().min(10, "Description must be at least 10 characters"),
    operatingHours: operatingHoursSchema,
    photos: z.array(photoSchema),
    isVerified: z.boolean(),
    status: z.string(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type Business = z.infer<typeof businessSchema>;
export type BusinessFormData = z.infer<typeof businessFormSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Address = z.infer<typeof addressSchema>;
export type OperatingHours = z.infer<typeof operatingHoursSchema>;
export type DayHours = z.infer<typeof dayHoursSchema>;
export type Photo = z.infer<typeof photoSchema>;
export type Coordinates = z.infer<typeof coordinatesSchema>;
