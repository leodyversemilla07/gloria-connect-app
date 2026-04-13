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
  type LoginFormData,
  loginPasswordSchema,
  loginSchema,
  nameSchema,
  passwordSchema,
  type RegisterFormData,
  registerSchema,
} from "./auth";

// Business schemas
export {
  type Address,
  addressSchema,
  type Business,
  type BusinessFormData,
  bilingualDescriptionSchema,
  bilingualNameSchema,
  businessFormSchema,
  businessMetadataSchema,
  businessSchema,
  type Contact,
  type Coordinates,
  categorySchema,
  contactSchema,
  coordinatesSchema,
  type DayHours,
  dayHoursSchema,
  latitudeSchema,
  longitudeSchema,
  type OperatingHours,
  operatingHoursSchema,
  type Photo,
  phoneSchema,
  photoSchema,
} from "./business";

// Common utilities
export {
  formatZodErrors,
  getFirstError,
  optionalEmailSchema,
  type SchemaInput,
  type SchemaOutput,
  urlSchema,
} from "./common";
