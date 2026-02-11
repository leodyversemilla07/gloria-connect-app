/**
 * Centralized Zod Schema Library
 * 
 * This module exports all validation schemas for the Gloria Connect App.
 * Use these schemas for form validation, API input validation, and type inference.
 * 
 * @example
 * ```tsx
 * import { loginSchema, type LoginFormData } from "@/lib/schemas";
 * 
 * const form = useForm<LoginFormData>({
 *   validators: { onSubmit: loginSchema },
 * });
 * ```
 */

// Auth schemas
export {
    emailSchema,
    passwordSchema,
    loginPasswordSchema,
    nameSchema,
    loginSchema,
    registerSchema,
    type LoginFormData,
    type RegisterFormData,
} from "./auth";

// Business schemas
export {
    phoneSchema,
    latitudeSchema,
    longitudeSchema,
    coordinatesSchema,
    contactSchema,
    addressSchema,
    dayHoursSchema,
    operatingHoursSchema,
    photoSchema,
    bilingualNameSchema,
    bilingualDescriptionSchema,
    categorySchema,
    businessMetadataSchema,
    businessSchema,
    businessFormSchema,
    type Business,
    type BusinessFormData,
    type Contact,
    type Address,
    type OperatingHours,
    type DayHours,
    type Photo,
    type Coordinates,
} from "./business";

// Common utilities
export {
    urlSchema,
    optionalEmailSchema,
    formatZodErrors,
    getFirstError,
    type SchemaInput,
    type SchemaOutput,
} from "./common";
