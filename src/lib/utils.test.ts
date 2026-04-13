import { describe, expect, it } from "vitest";
import {
  addressSchema,
  bilingualDescriptionSchema,
  bilingualNameSchema,
  businessFormSchema,
  businessMetadataSchema,
  categorySchema,
  contactSchema,
  coordinatesSchema,
  dayHoursSchema,
  latitudeSchema,
  longitudeSchema,
  phoneSchema,
  photoSchema,
} from "./schemas/business";
import { cn } from "./utils";

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const condition = true;
    expect(cn("foo", condition && "bar")).toBe("foo bar");
    expect(cn("foo", condition && "")).toBe("foo");
  });

  it("handles arrays", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("merges tailwind classes correctly", () => {
    expect(cn("px-2 px-4")).toBe("px-4");
    expect(cn("bg-red-500 bg-blue-500")).toBe("bg-blue-500");
  });
});

describe("phoneSchema", () => {
  it("validates Philippine phone numbers with +63", () => {
    expect(phoneSchema.safeParse("+639123456789").success).toBe(true);
  });

  it("validates Philippine phone numbers with 0 prefix", () => {
    expect(phoneSchema.safeParse("09123456789").success).toBe(true);
  });

  it("validates phone numbers with spaces", () => {
    expect(phoneSchema.safeParse("0912 345 6789").success).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    expect(phoneSchema.safeParse("123").success).toBe(false);
  });
});

describe("latitudeSchema", () => {
  it("validates valid latitude", () => {
    expect(latitudeSchema.safeParse(0).success).toBe(true);
    expect(latitudeSchema.safeParse(45).success).toBe(true);
    expect(latitudeSchema.safeParse(-45).success).toBe(true);
  });

  it("rejects latitude out of range", () => {
    expect(latitudeSchema.safeParse(91).success).toBe(false);
    expect(latitudeSchema.safeParse(-91).success).toBe(false);
  });
});

describe("longitudeSchema", () => {
  it("validates valid longitude", () => {
    expect(longitudeSchema.safeParse(0).success).toBe(true);
    expect(longitudeSchema.safeParse(180).success).toBe(true);
    expect(longitudeSchema.safeParse(-180).success).toBe(true);
  });

  it("rejects longitude out of range", () => {
    expect(longitudeSchema.safeParse(181).success).toBe(false);
    expect(longitudeSchema.safeParse(-181).success).toBe(false);
  });
});

describe("coordinatesSchema", () => {
  it("validates valid coordinates", () => {
    const result = coordinatesSchema.safeParse({
      latitude: 12.1234,
      longitude: 123.4567,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid coordinates", () => {
    const result = coordinatesSchema.safeParse({
      latitude: 100,
      longitude: 200,
    });
    expect(result.success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("validates valid contact info", () => {
    const result = contactSchema.safeParse({
      phone: "09123456789",
      email: "test@example.com",
      website: "https://example.com",
    });
    expect(result.success).toBe(true);
  });

  it("validates contact without optional fields", () => {
    const result = contactSchema.safeParse({
      phone: "09123456789",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      phone: "09123456789",
      email: "invalid-email",
    });
    expect(result.success).toBe(false);
  });
});

describe("addressSchema", () => {
  it("validates valid address", () => {
    const result = addressSchema.safeParse({
      street: "123 Main St",
      barangay: "Poblacion",
      coordinates: {
        latitude: 12.1234,
        longitude: 123.4567,
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects address without required fields", () => {
    const result = addressSchema.safeParse({
      street: "123 Main St",
      barangay: "",
      coordinates: {
        latitude: 12.1234,
        longitude: 123.4567,
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("bilingualNameSchema", () => {
  it("validates bilingual names", () => {
    const result = bilingualNameSchema.safeParse({
      english: "Test Business",
      tagalog: "Negosyong Pansubok",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty English name", () => {
    const result = bilingualNameSchema.safeParse({
      english: "",
      tagalog: "Test",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty Tagalog name", () => {
    const result = bilingualNameSchema.safeParse({
      english: "Test",
      tagalog: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("bilingualDescriptionSchema", () => {
  it("validates bilingual descriptions", () => {
    const result = bilingualDescriptionSchema.safeParse({
      english: "A wonderful business description",
      tagalog: "Isang magandang paglalarawan ng negosyo",
    });
    expect(result.success).toBe(true);
  });

  it("rejects descriptions shorter than 10 characters", () => {
    const result = bilingualDescriptionSchema.safeParse({
      english: "Short",
      tagalog: "Maikli",
    });
    expect(result.success).toBe(false);
  });
});

describe("dayHoursSchema", () => {
  it("validates day hours", () => {
    const result = dayHoursSchema.safeParse({
      open: "09:00",
      close: "17:00",
      closed: false,
    });
    expect(result.success).toBe(true);
  });

  it("accepts closed days", () => {
    const result = dayHoursSchema.safeParse({
      open: "00:00",
      close: "00:00",
      closed: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("photoSchema", () => {
  it("validates photo with URL", () => {
    const result = photoSchema.safeParse({
      url: "https://example.com/photo.jpg",
      alt: "Business photo",
      isPrimary: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty URL string", () => {
    const result = photoSchema.safeParse({
      url: "",
      alt: "Photo",
      isPrimary: false,
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional storageId", () => {
    const result = photoSchema.safeParse({
      url: "https://example.com/photo.jpg",
      storageId: "storage_123",
      alt: "Photo",
      isPrimary: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("categorySchema", () => {
  it("validates category with primary only", () => {
    const result = categorySchema.safeParse({
      primary: "restaurants",
    });
    expect(result.success).toBe(true);
  });

  it("validates category with secondary categories", () => {
    const result = categorySchema.safeParse({
      primary: "restaurants",
      secondary: ["filipino", "casual-dining"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty primary category", () => {
    const result = categorySchema.safeParse({
      primary: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("businessMetadataSchema", () => {
  it("validates metadata with required fields", () => {
    const result = businessMetadataSchema.safeParse({
      isVerified: true,
      status: "active",
    });
    expect(result.success).toBe(true);
  });

  it("validates all status values", () => {
    const statuses = ["active", "inactive", "pending"];
    statuses.forEach((status) => {
      const result = businessMetadataSchema.safeParse({
        isVerified: false,
        status,
      });
      expect(result.success).toBe(true);
    });
  });

  it("rejects invalid status", () => {
    const result = businessMetadataSchema.safeParse({
      isVerified: true,
      status: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = businessMetadataSchema.safeParse({
      isVerified: true,
      status: "active",
      target: "Target value",
      limit: "Limit value",
      reviewer: "Admin",
    });
    expect(result.success).toBe(true);
  });
});

describe("businessFormSchema", () => {
  it("validates complete business form data", () => {
    const result = businessFormSchema.safeParse({
      nameEnglish: "Test Business",
      nameTagalog: "Test Negosyo",
      categoryPrimary: "restaurants",
      categorySecondary: [],
      phone: "09123456789",
      email: "test@business.com",
      website: "",
      addressStreet: "123 Main St",
      addressBarangay: "Poblacion",
      addressLatitude: "12.1234",
      addressLongitude: "123.4567",
      descriptionEnglish: "A great restaurant",
      descriptionTagalog: "Isang magandang restaurant",
      operatingHours: {
        monday: { open: "08:00", close: "18:00", closed: false },
        tuesday: { open: "08:00", close: "18:00", closed: false },
        wednesday: { open: "08:00", close: "18:00", closed: false },
        thursday: { open: "08:00", close: "18:00", closed: false },
        friday: { open: "08:00", close: "18:00", closed: false },
        saturday: { open: "08:00", close: "18:00", closed: false },
        sunday: { open: "08:00", close: "18:00", closed: true },
      },
      photos: [],
      isVerified: false,
      status: "pending",
    });
    expect(result.success).toBe(true);
  });

  it("rejects business form with missing required fields", () => {
    const result = businessFormSchema.safeParse({
      nameEnglish: "",
      nameTagalog: "",
      categoryPrimary: "",
      categorySecondary: [],
      phone: "123",
      email: "",
      website: "",
      addressStreet: "",
      addressBarangay: "",
      addressLatitude: "",
      addressLongitude: "",
      descriptionEnglish: "",
      descriptionTagalog: "",
      operatingHours: {
        monday: { open: "08:00", close: "18:00", closed: false },
        tuesday: { open: "08:00", close: "18:00", closed: false },
        wednesday: { open: "08:00", close: "18:00", closed: false },
        thursday: { open: "08:00", close: "18:00", closed: false },
        friday: { open: "08:00", close: "18:00", closed: false },
        saturday: { open: "08:00", close: "18:00", closed: false },
        sunday: { open: "08:00", close: "18:00", closed: false },
      },
      photos: [],
      isVerified: false,
      status: "pending",
    });
    expect(result.success).toBe(false);
  });

  it("validates latitude and longitude boundaries", () => {
    const result = businessFormSchema.safeParse({
      nameEnglish: "Test",
      nameTagalog: "Test",
      categoryPrimary: "restaurants",
      categorySecondary: [],
      phone: "09123456789",
      addressStreet: "Street",
      addressBarangay: "Barangay",
      addressLatitude: "90",
      addressLongitude: "180",
      descriptionEnglish: "Description long enough",
      descriptionTagalog: "Sapat na paglalarawan",
      operatingHours: {
        monday: { open: "08:00", close: "18:00", closed: false },
        tuesday: { open: "08:00", close: "18:00", closed: false },
        wednesday: { open: "08:00", close: "18:00", closed: false },
        thursday: { open: "08:00", close: "18:00", closed: false },
        friday: { open: "08:00", close: "18:00", closed: false },
        saturday: { open: "08:00", close: "18:00", closed: false },
        sunday: { open: "08:00", close: "18:00", closed: false },
      },
      photos: [],
      isVerified: false,
      status: "pending",
    });
    expect(result.success).toBe(true);
  });

  it("rejects out of range coordinates", () => {
    const result = businessFormSchema.safeParse({
      nameEnglish: "Test",
      nameTagalog: "Test",
      categoryPrimary: "restaurants",
      categorySecondary: [],
      phone: "09123456789",
      addressStreet: "Street",
      addressBarangay: "Barangay",
      addressLatitude: "91",
      addressLongitude: "181",
      descriptionEnglish: "Description long enough",
      descriptionTagalog: "Sapat na paglalarawan",
      operatingHours: {
        monday: { open: "08:00", close: "18:00", closed: false },
        tuesday: { open: "08:00", close: "18:00", closed: false },
        wednesday: { open: "08:00", close: "18:00", closed: false },
        thursday: { open: "08:00", close: "18:00", closed: false },
        friday: { open: "08:00", close: "18:00", closed: false },
        saturday: { open: "08:00", close: "18:00", closed: false },
        sunday: { open: "08:00", close: "18:00", closed: false },
      },
      photos: [],
      isVerified: false,
      status: "pending",
    });
    expect(result.success).toBe(false);
  });
});
