import type { Id } from "@/../../convex/_generated/dataModel";

/**
 * Mock business data for testing
 */
export interface MockBusiness {
  _id: Id<"businesses">;
  _creationTime: number;
  businessId?: string;
  name: string | { english: string; tagalog: string };
  category: {
    primary: string;
    secondary?: string[];
  };
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  address: {
    street: string;
    barangay: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  description: string | { english: string; tagalog: string };
  operatingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  photos?: Array<{
    url: string;
    storageId?: Id<"_storage">;
    alt: string;
    isPrimary: boolean;
  }>;
  metadata: {
    dateAdded: string;
    lastUpdated: string;
    isVerified: boolean;
    status: "active" | "inactive" | "pending";
    target?: string;
    limit?: string;
    reviewer?: string;
  };
}

/**
 * Default operating hours (9am-5pm weekdays, closed Sunday)
 */
const defaultOperatingHours = {
  monday: { open: "09:00", close: "17:00", closed: false },
  tuesday: { open: "09:00", close: "17:00", closed: false },
  wednesday: { open: "09:00", close: "17:00", closed: false },
  thursday: { open: "09:00", close: "17:00", closed: false },
  friday: { open: "09:00", close: "17:00", closed: false },
  saturday: { open: "10:00", close: "14:00", closed: false },
  sunday: { open: "00:00", close: "00:00", closed: true },
};

/**
 * Create a mock business with default values
 */
export function createMockBusiness(overrides: Partial<MockBusiness> = {}): MockBusiness {
  const now = new Date().toISOString();

  const defaults: MockBusiness = {
    _id: "business_mock123" as Id<"businesses">,
    _creationTime: Date.now(),
    businessId: "BUS-001",
    name: "Test Business",
    category: {
      primary: "restaurants",
      secondary: ["filipino", "casual-dining"],
    },
    contact: {
      phone: "09123456789",
      email: "contact@testbusiness.com",
      website: "https://testbusiness.com",
    },
    address: {
      street: "123 Main Street",
      barangay: "Poblacion",
      coordinates: {
        latitude: 12.959444,
        longitude: 121.203611,
      },
    },
    description: "A great test business for testing purposes",
    operatingHours: defaultOperatingHours,
    photos: [
      {
        url: "https://example.com/photo1.jpg",
        alt: "Business exterior",
        isPrimary: true,
      },
    ],
    metadata: {
      dateAdded: now,
      lastUpdated: now,
      isVerified: true,
      status: "active",
    },
  };

  return { ...defaults, ...overrides };
}

/**
 * Create a bilingual business (with English and Tagalog names/descriptions)
 */
export function createBilingualBusiness(overrides: Partial<MockBusiness> = {}): MockBusiness {
  return createMockBusiness({
    name: {
      english: "Test Business",
      tagalog: "Negosyong Pansubok",
    },
    description: {
      english: "A great test business",
      tagalog: "Isang magandang negosyo para sa pagsusulit",
    },
    ...overrides,
  });
}

/**
 * Create a pending (unverified) business
 */
export function createPendingBusiness(overrides: Partial<MockBusiness> = {}): MockBusiness {
  return createMockBusiness({
    metadata: {
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isVerified: false,
      status: "pending",
    },
    ...overrides,
  });
}

/**
 * Create an inactive business
 */
export function createInactiveBusiness(overrides: Partial<MockBusiness> = {}): MockBusiness {
  return createMockBusiness({
    metadata: {
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isVerified: true,
      status: "inactive",
    },
    ...overrides,
  });
}

/**
 * Create multiple mock businesses for testing lists
 */
export function createMockBusinesses(count: number): MockBusiness[] {
  return Array.from({ length: count }, (_, i) =>
    createMockBusiness({
      _id: `business_mock${i}` as Id<"businesses">,
      businessId: `BUS-${String(i + 1).padStart(3, "0")}`,
      name: `Business ${i + 1}`,
      contact: {
        phone: `0912345${String(i).padStart(4, "0")}`,
      },
    }),
  );
}

/**
 * Create businesses by category
 */
export function createBusinessesByCategory(category: string, count: number): MockBusiness[] {
  return Array.from({ length: count }, (_, i) =>
    createMockBusiness({
      _id: `business_${category}_${i}` as Id<"businesses">,
      name: `${category} Business ${i + 1}`,
      category: {
        primary: category,
      },
    }),
  );
}

/**
 * Common business categories for testing
 */
export const BUSINESS_CATEGORIES = {
  RESTAURANTS: "restaurants",
  LODGING: "lodging",
  HEALTHCARE: "healthcare",
  RETAIL: "retail",
  SERVICES: "services",
  AUTOMOTIVE: "automotive",
  EDUCATION: "education",
  ENTERTAINMENT: "entertainment",
} as const;
