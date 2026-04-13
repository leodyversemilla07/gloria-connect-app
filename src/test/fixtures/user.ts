import type { Id } from "@/../../convex/_generated/dataModel";

/**
 * Mock user data for testing
 */
export interface MockUser {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  name?: string;
  image?: string;
  phone?: string;
  emailVerificationTime?: number;
  phoneVerificationTime?: number;
  isAdmin?: boolean;
  isAnonymous?: boolean;
}

/**
 * Create a mock user with default values
 * Can override any field by passing partial data
 */
export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  const defaults: MockUser = {
    _id: "user_mock123" as Id<"users">,
    _creationTime: Date.now(),
    email: "test@example.com",
    name: "Test User",
    image: "https://example.com/avatar.jpg",
    emailVerificationTime: Date.now(),
    isAdmin: false,
    isAnonymous: false,
  };

  return { ...defaults, ...overrides };
}

/**
 * Create a mock admin user
 */
export function createMockAdmin(overrides: Partial<MockUser> = {}): MockUser {
  return createMockUser({
    email: "admin@example.com",
    name: "Admin User",
    isAdmin: true,
    ...overrides,
  });
}

/**
 * Create multiple mock users for testing lists
 */
export function createMockUsers(count: number): MockUser[] {
  return Array.from({ length: count }, (_, i) =>
    createMockUser({
      _id: `user_mock${i}` as Id<"users">,
      email: `user${i}@example.com`,
      name: `User ${i}`,
    }),
  );
}

/**
 * Create an unverified user (no email verification)
 */
export function createUnverifiedUser(overrides: Partial<MockUser> = {}): MockUser {
  return createMockUser({
    emailVerificationTime: undefined,
    ...overrides,
  });
}
