import { describe, it, expect } from 'vitest';
import {
  createMockBusiness,
  createBilingualBusiness,
  createPendingBusiness,
  createInactiveBusiness,
  createMockBusinesses,
  createBusinessesByCategory,
  BUSINESS_CATEGORIES,
} from './business';

describe('Business Fixtures', () => {
  describe('createMockBusiness', () => {
    it('creates a mock business with default values', () => {
      const business = createMockBusiness();

      expect(business._id).toBeDefined();
      expect(business._creationTime).toBeDefined();
      expect(business.name).toBe('Test Business');
      expect(business.category.primary).toBe('restaurants');
      expect(business.contact.phone).toBe('09123456789');
      expect(business.address.barangay).toBe('Poblacion');
      expect(business.metadata.status).toBe('active');
      expect(business.metadata.isVerified).toBe(true);
    });

    it('allows overriding default values', () => {
      const business = createMockBusiness({
        name: 'Custom Business',
        category: { primary: 'lodging' },
      });

      expect(business.name).toBe('Custom Business');
      expect(business.category.primary).toBe('lodging');
    });

    it('includes operating hours', () => {
      const business = createMockBusiness();

      expect(business.operatingHours.monday).toEqual({
        open: '09:00',
        close: '17:00',
        closed: false,
      });
      expect(business.operatingHours.sunday.closed).toBe(true);
    });

    it('includes photos', () => {
      const business = createMockBusiness();

      expect(business.photos).toHaveLength(1);
      expect(business.photos?.[0].isPrimary).toBe(true);
    });
  });

  describe('createBilingualBusiness', () => {
    it('creates business with bilingual name and description', () => {
      const business = createBilingualBusiness();

      expect(typeof business.name).toBe('object');
      expect(business.name).toHaveProperty('english');
      expect(business.name).toHaveProperty('tagalog');

      expect(typeof business.description).toBe('object');
      expect(business.description).toHaveProperty('english');
      expect(business.description).toHaveProperty('tagalog');
    });

    it('allows overriding bilingual fields', () => {
      const business = createBilingualBusiness({
        name: {
          english: 'Custom Store',
          tagalog: 'Tindahan',
        },
      });

      if (typeof business.name === 'object') {
        expect(business.name.english).toBe('Custom Store');
        expect(business.name.tagalog).toBe('Tindahan');
      }
    });
  });

  describe('createPendingBusiness', () => {
    it('creates an unverified pending business', () => {
      const business = createPendingBusiness();

      expect(business.metadata.status).toBe('pending');
      expect(business.metadata.isVerified).toBe(false);
    });
  });

  describe('createInactiveBusiness', () => {
    it('creates an inactive business', () => {
      const business = createInactiveBusiness();

      expect(business.metadata.status).toBe('inactive');
      expect(business.metadata.isVerified).toBe(true);
    });
  });

  describe('createMockBusinesses', () => {
    it('creates multiple businesses', () => {
      const businesses = createMockBusinesses(3);

      expect(businesses).toHaveLength(3);
      expect(businesses[0].businessId).toBe('BUS-001');
      expect(businesses[1].businessId).toBe('BUS-002');
      expect(businesses[2].businessId).toBe('BUS-003');
    });

    it('creates businesses with unique IDs', () => {
      const businesses = createMockBusinesses(5);
      const ids = businesses.map(b => b._id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(5);
    });
  });

  describe('createBusinessesByCategory', () => {
    it('creates businesses in specific category', () => {
      const restaurants = createBusinessesByCategory('restaurants', 3);

      expect(restaurants).toHaveLength(3);
      restaurants.forEach(b => {
        expect(b.category.primary).toBe('restaurants');
      });
    });

    it('generates unique names for each business', () => {
      const businesses = createBusinessesByCategory('retail', 2);

      expect(businesses[0].name).toBe('retail Business 1');
      expect(businesses[1].name).toBe('retail Business 2');
    });
  });

  describe('BUSINESS_CATEGORIES', () => {
    it('exports all category constants', () => {
      expect(BUSINESS_CATEGORIES.RESTAURANTS).toBe('restaurants');
      expect(BUSINESS_CATEGORIES.LODGING).toBe('lodging');
      expect(BUSINESS_CATEGORIES.HEALTHCARE).toBe('healthcare');
      expect(BUSINESS_CATEGORIES.RETAIL).toBe('retail');
      expect(BUSINESS_CATEGORIES.SERVICES).toBe('services');
      expect(BUSINESS_CATEGORIES.AUTOMOTIVE).toBe('automotive');
      expect(BUSINESS_CATEGORIES.EDUCATION).toBe('education');
      expect(BUSINESS_CATEGORIES.ENTERTAINMENT).toBe('entertainment');
    });
  });
});
