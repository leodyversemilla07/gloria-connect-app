import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  passwordSchema,
  loginPasswordSchema,
  nameSchema,
  loginSchema,
  registerSchema,
} from './auth';

describe('Auth Schemas', () => {
  describe('emailSchema', () => {
    it('validates correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'test123@test-domain.com',
      ];

      validEmails.forEach(email => {
        const result = emailSchema.safeParse(email);
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@domain',
      ];

      invalidEmails.forEach(email => {
        const result = emailSchema.safeParse(email);
        expect(result.success).toBe(false);
      });
    });

    it('rejects empty email', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is required');
      }
    });

    it('shows proper error message for invalid format', () => {
      const result = emailSchema.safeParse('invalid-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });
  });

  describe('passwordSchema', () => {
    it('validates strong passwords', () => {
      const validPasswords = [
        'Password1',
        'MyP@ssw0rd',
        'Test1234',
        'Abc12345',
      ];

      validPasswords.forEach(password => {
        const result = passwordSchema.safeParse(password);
        expect(result.success).toBe(true);
      });
    });

    it('rejects passwords shorter than 8 characters', () => {
      const result = passwordSchema.safeParse('Pass1');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 8 characters');
      }
    });

    it('rejects passwords without numbers', () => {
      const result = passwordSchema.safeParse('Password');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('at least one number')
        )).toBe(true);
      }
    });

    it('rejects passwords without lowercase letters', () => {
      const result = passwordSchema.safeParse('PASSWORD1');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('one lowercase letter')
        )).toBe(true);
      }
    });

    it('rejects passwords without uppercase letters', () => {
      const result = passwordSchema.safeParse('password1');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('one uppercase letter')
        )).toBe(true);
      }
    });

    it('rejects empty password', () => {
      const result = passwordSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('allows special characters', () => {
      const result = passwordSchema.safeParse('P@ssw0rd!');
      expect(result.success).toBe(true);
    });

    it('allows passwords longer than 8 characters', () => {
      const result = passwordSchema.safeParse('VeryLongPassword123');
      expect(result.success).toBe(true);
    });
  });

  describe('loginPasswordSchema', () => {
    it('accepts any non-empty password', () => {
      const passwords = ['weak', '12345', 'Password123', 'a'];
      
      passwords.forEach(password => {
        const result = loginPasswordSchema.safeParse(password);
        expect(result.success).toBe(true);
      });
    });

    it('rejects empty password', () => {
      const result = loginPasswordSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required');
      }
    });
  });

  describe('nameSchema', () => {
    it('validates correct names', () => {
      const validNames = [
        'John Doe',
        'María García',
        'José Rizal',
        'Test User 123',
      ];

      validNames.forEach(name => {
        const result = nameSchema.safeParse(name);
        expect(result.success).toBe(true);
      });
    });

    it('rejects names shorter than 2 characters', () => {
      const result = nameSchema.safeParse('A');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters');
      }
    });

    it('rejects names longer than 100 characters', () => {
      const longName = 'A'.repeat(101);
      const result = nameSchema.safeParse(longName);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 100 characters');
      }
    });

    it('accepts exactly 100 characters', () => {
      const maxName = 'A'.repeat(100);
      const result = nameSchema.safeParse(maxName);
      expect(result.success).toBe(true);
    });

    it('accepts exactly 2 characters', () => {
      const result = nameSchema.safeParse('Ab');
      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    it('validates complete login form', () => {
      const loginData = {
        email: 'test@example.com',
        password: 'anypassword',
      };

      const result = loginSchema.safeParse(loginData);
      expect(result.success).toBe(true);
    });

    it('rejects login with invalid email', () => {
      const loginData = {
        email: 'invalid-email',
        password: 'password',
      };

      const result = loginSchema.safeParse(loginData);
      expect(result.success).toBe(false);
    });

    it('rejects login with empty password', () => {
      const loginData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(loginData);
      expect(result.success).toBe(false);
    });

    it('rejects login with missing fields', () => {
      const result = loginSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('returns typed data when valid', () => {
      const loginData = {
        email: 'test@example.com',
        password: 'mypassword',
      };

      const result = loginSchema.safeParse(loginData);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.password).toBe('mypassword');
      }
    });
  });

  describe('registerSchema', () => {
    it('validates complete registration form', () => {
      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      const result = registerSchema.safeParse(registerData);
      expect(result.success).toBe(true);
    });

    it('rejects registration with weak password', () => {
      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'weak',
      };

      const result = registerSchema.safeParse(registerData);
      expect(result.success).toBe(false);
    });

    it('rejects registration with invalid email', () => {
      const registerData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123',
      };

      const result = registerSchema.safeParse(registerData);
      expect(result.success).toBe(false);
    });

    it('rejects registration with short name', () => {
      const registerData = {
        name: 'A',
        email: 'test@example.com',
        password: 'Password123',
      };

      const result = registerSchema.safeParse(registerData);
      expect(result.success).toBe(false);
    });

    it('rejects registration with missing fields', () => {
      const result = registerSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('returns typed data when valid', () => {
      const registerData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass1',
      };

      const result = registerSchema.safeParse(registerData);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
        expect(result.data.email).toBe('john@example.com');
        expect(result.data.password).toBe('SecurePass1');
      }
    });
  });
});
