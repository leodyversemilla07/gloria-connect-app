import { describe, expect, it } from "vitest";
import { formatZodErrors, getFirstError, optionalEmailSchema, urlSchema } from "./common";

describe("Common Schemas", () => {
  describe("urlSchema", () => {
    it("validates correct URLs", () => {
      const validUrls = [
        "https://example.com",
        "http://example.com",
        "https://www.example.com/path",
        "https://example.com:8080",
        "https://sub.domain.example.com",
        "https://example.com/path?query=value",
      ];

      validUrls.forEach((url) => {
        const result = urlSchema.safeParse(url);
        expect(result.success).toBe(true);
      });
    });

    it("rejects invalid URLs", () => {
      const invalidUrls = ["not-a-url", "just text", "://noprotocol.com"];

      invalidUrls.forEach((url) => {
        const result = urlSchema.safeParse(url);
        expect(result.success).toBe(false);
      });
    });

    it("accepts empty string", () => {
      const result = urlSchema.safeParse("");
      expect(result.success).toBe(true);
    });

    it("accepts undefined", () => {
      const result = urlSchema.safeParse(undefined);
      expect(result.success).toBe(true);
    });

    it("shows proper error message for invalid URL", () => {
      const result = urlSchema.safeParse("invalid-url");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Please enter a valid URL");
      }
    });
  });

  describe("optionalEmailSchema", () => {
    it("validates correct email addresses", () => {
      const validEmails = ["test@example.com", "user+tag@domain.co.uk", "name.surname@company.com"];

      validEmails.forEach((email) => {
        const result = optionalEmailSchema.safeParse(email);
        expect(result.success).toBe(true);
      });
    });

    it("rejects invalid email addresses", () => {
      const invalidEmails = ["notanemail", "@example.com", "user@", "user @domain.com"];

      invalidEmails.forEach((email) => {
        const result = optionalEmailSchema.safeParse(email);
        expect(result.success).toBe(false);
      });
    });

    it("accepts empty string", () => {
      const result = optionalEmailSchema.safeParse("");
      expect(result.success).toBe(true);
    });

    it("accepts undefined", () => {
      const result = optionalEmailSchema.safeParse(undefined);
      expect(result.success).toBe(true);
    });

    it("shows proper error message for invalid email", () => {
      const result = optionalEmailSchema.safeParse("invalid-email");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Please enter a valid email address");
      }
    });
  });

  describe("formatZodErrors", () => {
    it("returns empty string for undefined errors", () => {
      const result = formatZodErrors(undefined);
      expect(result).toBe("");
    });

    it("returns empty string for empty array", () => {
      const result = formatZodErrors([]);
      expect(result).toBe("");
    });

    it("formats string errors", () => {
      const errors = ["Error 1", "Error 2"];
      const result = formatZodErrors(errors);
      expect(result).toBe("Error 1, Error 2");
    });

    it("formats object errors with message property", () => {
      const errors = [{ message: "First error" }, { message: "Second error" }];
      const result = formatZodErrors(errors);
      expect(result).toBe("First error, Second error");
    });

    it("handles mixed error types", () => {
      const errors = ["String error", { message: "Object error" }, "Another string"];
      const result = formatZodErrors(errors);
      expect(result).toBe("String error, Object error, Another string");
    });

    it("handles invalid error objects", () => {
      const errors = [{ notAMessage: "value" }, null, undefined];
      const result = formatZodErrors(errors);
      expect(result).toContain("Invalid input");
    });

    it("joins multiple errors with comma and space", () => {
      const errors = ["Error A", "Error B", "Error C"];
      const result = formatZodErrors(errors);
      expect(result).toBe("Error A, Error B, Error C");
    });
  });

  describe("getFirstError", () => {
    it("returns null for successful validation", () => {
      const result = { success: true as const };
      expect(getFirstError(result)).toBeNull();
    });

    it("returns first error message", () => {
      const result = {
        success: false as const,
        error: {
          issues: [{ message: "First error" }, { message: "Second error" }],
        },
      };
      expect(getFirstError(result)).toBe("First error");
    });

    it("returns default message when no issues", () => {
      const result = {
        success: false as const,
        error: { issues: [] },
      };
      expect(getFirstError(result)).toBe("Validation failed");
    });

    it("returns default message when error is undefined", () => {
      const result = {
        success: false as const,
      };
      expect(getFirstError(result)).toBe("Validation failed");
    });

    it("handles missing error object", () => {
      const result = {
        success: false as const,
        error: undefined,
      };
      expect(getFirstError(result)).toBe("Validation failed");
    });
  });
});
