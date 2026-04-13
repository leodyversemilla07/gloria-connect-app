/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ResendPasswordReset from "../ResendPasswordReset.js";
import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as auth_helpers from "../auth_helpers.js";
import type * as businesses from "../businesses.js";
import type * as businesses_admin from "../businesses/admin.js";
import type * as businesses_public from "../businesses/public.js";
import type * as businesses_validators from "../businesses/validators.js";
import type * as cleanup from "../cleanup.js";
import type * as createAdmin from "../createAdmin.js";
import type * as email_resendPasswordReset from "../email/resendPasswordReset.js";
import type * as email_verification from "../email/verification.js";
import type * as emailVerification from "../emailVerification.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as migrateAuthRefreshTokens from "../migrateAuthRefreshTokens.js";
import type * as scripts_cleanup from "../scripts/cleanup.js";
import type * as scripts_createAdmin from "../scripts/createAdmin.js";
import type * as scripts_migrateAuthRefreshTokens from "../scripts/migrateAuthRefreshTokens.js";
import type * as scripts_shell from "../scripts/shell.js";
import type * as shell from "../shell.js";
import type * as users from "../users.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as users_shared from "../users/shared.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ResendPasswordReset: typeof ResendPasswordReset;
  analytics: typeof analytics;
  auth: typeof auth;
  auth_helpers: typeof auth_helpers;
  businesses: typeof businesses;
  "businesses/admin": typeof businesses_admin;
  "businesses/public": typeof businesses_public;
  "businesses/validators": typeof businesses_validators;
  cleanup: typeof cleanup;
  createAdmin: typeof createAdmin;
  "email/resendPasswordReset": typeof email_resendPasswordReset;
  "email/verification": typeof email_verification;
  emailVerification: typeof emailVerification;
  files: typeof files;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  migrateAuthRefreshTokens: typeof migrateAuthRefreshTokens;
  "scripts/cleanup": typeof scripts_cleanup;
  "scripts/createAdmin": typeof scripts_createAdmin;
  "scripts/migrateAuthRefreshTokens": typeof scripts_migrateAuthRefreshTokens;
  "scripts/shell": typeof scripts_shell;
  shell: typeof shell;
  users: typeof users;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
  "users/shared": typeof users_shared;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
