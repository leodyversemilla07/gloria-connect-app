import { describe, it, expect } from 'vitest';
import { 
  createMockUser, 
  createMockAdmin, 
  createMockUsers,
  createUnverifiedUser 
} from './user';

describe('User Fixtures', () => {
  describe('createMockUser', () => {
    it('creates a mock user with default values', () => {
      const user = createMockUser();
      
      expect(user._id).toBeDefined();
      expect(user._creationTime).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.isAdmin).toBe(false);
      expect(user.emailVerificationTime).toBeDefined();
    });

    it('allows overriding default values', () => {
      const user = createMockUser({
        email: 'custom@example.com',
        name: 'Custom User',
        isAdmin: true,
      });
      
      expect(user.email).toBe('custom@example.com');
      expect(user.name).toBe('Custom User');
      expect(user.isAdmin).toBe(true);
    });

    it('preserves other default values when overriding', () => {
      const user = createMockUser({ name: 'Override' });
      
      expect(user.name).toBe('Override');
      expect(user.email).toBe('test@example.com'); // Still has default
      expect(user._id).toBeDefined();
    });
  });

  describe('createMockAdmin', () => {
    it('creates an admin user', () => {
      const admin = createMockAdmin();
      
      expect(admin.isAdmin).toBe(true);
      expect(admin.email).toBe('admin@example.com');
      expect(admin.name).toBe('Admin User');
    });

    it('allows overriding admin properties', () => {
      const admin = createMockAdmin({ name: 'Super Admin' });
      
      expect(admin.name).toBe('Super Admin');
      expect(admin.isAdmin).toBe(true);
    });
  });

  describe('createMockUsers', () => {
    it('creates multiple users', () => {
      const users = createMockUsers(3);
      
      expect(users).toHaveLength(3);
      expect(users[0].email).toBe('user0@example.com');
      expect(users[1].email).toBe('user1@example.com');
      expect(users[2].email).toBe('user2@example.com');
    });

    it('creates users with unique IDs', () => {
      const users = createMockUsers(5);
      const ids = users.map(u => u._id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(5);
    });

    it('handles edge case of zero users', () => {
      const users = createMockUsers(0);
      expect(users).toHaveLength(0);
    });
  });

  describe('createUnverifiedUser', () => {
    it('creates user without email verification', () => {
      const user = createUnverifiedUser();
      
      expect(user.emailVerificationTime).toBeUndefined();
      expect(user.email).toBeDefined();
    });

    it('allows setting other properties', () => {
      const user = createUnverifiedUser({ name: 'Unverified User' });
      
      expect(user.name).toBe('Unverified User');
      expect(user.emailVerificationTime).toBeUndefined();
    });
  });
});
