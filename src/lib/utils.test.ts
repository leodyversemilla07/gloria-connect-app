import { describe, it, expect } from 'vitest';
import { cn } from './utils';
import { 
  phoneSchema, 
  latitudeSchema, 
  longitudeSchema, 
  coordinatesSchema,
  contactSchema,
  addressSchema,
  businessFormSchema,
} from './schemas/business';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const condition = true;
    expect(cn('foo', condition && 'bar')).toBe('foo bar');
    expect(cn('foo', condition && '')).toBe('foo');
  });

  it('handles arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 px-4')).toBe('px-4');
    expect(cn('bg-red-500 bg-blue-500')).toBe('bg-blue-500');
  });
});

describe('phoneSchema', () => {
  it('validates Philippine phone numbers with +63', () => {
    expect(phoneSchema.safeParse('+639123456789').success).toBe(true);
  });

  it('validates Philippine phone numbers with 0 prefix', () => {
    expect(phoneSchema.safeParse('09123456789').success).toBe(true);
  });

  it('validates phone numbers with spaces', () => {
    expect(phoneSchema.safeParse('0912 345 6789').success).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    expect(phoneSchema.safeParse('123').success).toBe(false);
  });
});

describe('latitudeSchema', () => {
  it('validates valid latitude', () => {
    expect(latitudeSchema.safeParse(0).success).toBe(true);
    expect(latitudeSchema.safeParse(45).success).toBe(true);
    expect(latitudeSchema.safeParse(-45).success).toBe(true);
  });

  it('rejects latitude out of range', () => {
    expect(latitudeSchema.safeParse(91).success).toBe(false);
    expect(latitudeSchema.safeParse(-91).success).toBe(false);
  });
});

describe('longitudeSchema', () => {
  it('validates valid longitude', () => {
    expect(longitudeSchema.safeParse(0).success).toBe(true);
    expect(longitudeSchema.safeParse(180).success).toBe(true);
    expect(longitudeSchema.safeParse(-180).success).toBe(true);
  });

  it('rejects longitude out of range', () => {
    expect(longitudeSchema.safeParse(181).success).toBe(false);
    expect(longitudeSchema.safeParse(-181).success).toBe(false);
  });
});

describe('coordinatesSchema', () => {
  it('validates valid coordinates', () => {
    const result = coordinatesSchema.safeParse({
      latitude: 12.1234,
      longitude: 123.4567,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid coordinates', () => {
    const result = coordinatesSchema.safeParse({
      latitude: 100,
      longitude: 200,
    });
    expect(result.success).toBe(false);
  });
});

describe('contactSchema', () => {
  it('validates valid contact info', () => {
    const result = contactSchema.safeParse({
      phone: '09123456789',
      email: 'test@example.com',
      website: 'https://example.com',
    });
    expect(result.success).toBe(true);
  });

  it('validates contact without optional fields', () => {
    const result = contactSchema.safeParse({
      phone: '09123456789',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({
      phone: '09123456789',
      email: 'invalid-email',
    });
    expect(result.success).toBe(false);
  });
});

describe('addressSchema', () => {
  it('validates valid address', () => {
    const result = addressSchema.safeParse({
      street: '123 Main St',
      barangay: 'Poblacion',
      coordinates: {
        latitude: 12.1234,
        longitude: 123.4567,
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects address without required fields', () => {
    const result = addressSchema.safeParse({
      street: '123 Main St',
      barangay: '',
      coordinates: {
        latitude: 12.1234,
        longitude: 123.4567,
      },
    });
    expect(result.success).toBe(false);
  });
});

describe('businessFormSchema', () => {
  it('validates complete business form data', () => {
    const result = businessFormSchema.safeParse({
      nameEnglish: 'Test Business',
      nameTagalog: 'Test Negosyo',
      categoryPrimary: 'restaurants',
      categorySecondary: [],
      phone: '09123456789',
      email: 'test@business.com',
      website: '',
      addressStreet: '123 Main St',
      addressBarangay: 'Poblacion',
      addressLatitude: '12.1234',
      addressLongitude: '123.4567',
      descriptionEnglish: 'A great restaurant',
      descriptionTagalog: 'Isang magandang restaurant',
      operatingHours: {
        monday: { open: '08:00', close: '18:00', closed: false },
        tuesday: { open: '08:00', close: '18:00', closed: false },
        wednesday: { open: '08:00', close: '18:00', closed: false },
        thursday: { open: '08:00', close: '18:00', closed: false },
        friday: { open: '08:00', close: '18:00', closed: false },
        saturday: { open: '08:00', close: '18:00', closed: false },
        sunday: { open: '08:00', close: '18:00', closed: true },
      },
      photos: [],
      isVerified: false,
      status: 'pending',
    });
    expect(result.success).toBe(true);
  });

  it('rejects business form with missing required fields', () => {
    const result = businessFormSchema.safeParse({
      nameEnglish: '',
      nameTagalog: '',
      categoryPrimary: '',
      categorySecondary: [],
      phone: '123',
      email: '',
      website: '',
      addressStreet: '',
      addressBarangay: '',
      addressLatitude: '',
      addressLongitude: '',
      descriptionEnglish: '',
      descriptionTagalog: '',
      operatingHours: {
        monday: { open: '08:00', close: '18:00', closed: false },
        tuesday: { open: '08:00', close: '18:00', closed: false },
        wednesday: { open: '08:00', close: '18:00', closed: false },
        thursday: { open: '08:00', close: '18:00', closed: false },
        friday: { open: '08:00', close: '18:00', closed: false },
        saturday: { open: '08:00', close: '18:00', closed: false },
        sunday: { open: '08:00', close: '18:00', closed: false },
      },
      photos: [],
      isVerified: false,
      status: 'pending',
    });
    expect(result.success).toBe(false);
  });
});
