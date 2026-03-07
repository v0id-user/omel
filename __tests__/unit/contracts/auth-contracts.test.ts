import { describe, it, expect } from 'bun:test';
import {
  newCRMUserInfoSchema,
  personalInfoSchema,
  companyInfoSchema,
  companySizeSchema,
} from '@/features/auth/contracts';

describe('companySizeSchema', () => {
  it('accepts all valid sizes', () => {
    const sizes = ['1-9', '10-99', '100-499', '500-999', '1000-4999', '5000+'];
    for (const size of sizes) {
      expect(companySizeSchema.safeParse(size).success).toBe(true);
    }
  });

  it('rejects invalid sizes', () => {
    expect(companySizeSchema.safeParse('tiny').success).toBe(false);
    expect(companySizeSchema.safeParse('').success).toBe(false);
    expect(companySizeSchema.safeParse(100).success).toBe(false);
  });
});

describe('personalInfoSchema', () => {
  it('accepts valid personal info', () => {
    const result = personalInfoSchema.safeParse({
      firstName: 'Test',
      lastName: 'User',
      phone: '+966511111111',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing firstName', () => {
    const result = personalInfoSchema.safeParse({
      lastName: 'User',
      phone: '+966511111111',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty strings', () => {
    const result = personalInfoSchema.safeParse({
      firstName: '',
      lastName: 'User',
      phone: '+966511111111',
    });
    expect(result.success).toBe(false);
  });
});

describe('companyInfoSchema', () => {
  it('accepts full company info', () => {
    const result = companyInfoSchema.safeParse({
      name: 'Test Company',
      website: 'https://test.com',
      address: '123 Test St',
      size: '1-9',
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty company info (all optional)', () => {
    const result = companyInfoSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rejects invalid company size', () => {
    const result = companyInfoSchema.safeParse({ size: 'invalid' });
    expect(result.success).toBe(false);
  });
});

describe('newCRMUserInfoSchema', () => {
  it('accepts a valid CRM signup payload', () => {
    const result = newCRMUserInfoSchema.safeParse({
      email: 'test@gmail.com',
      password: 'password123',
      personalInfo: {
        firstName: 'Test',
        lastName: 'User',
        phone: '+966511111111',
      },
      companyInfo: {
        name: 'Test Company',
        website: 'https://test.com',
        address: '123 Test St',
        size: '1-9',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = newCRMUserInfoSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
      personalInfo: {
        firstName: 'Test',
        lastName: 'User',
        phone: '+966511111111',
      },
      companyInfo: {},
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = newCRMUserInfoSchema.safeParse({
      email: 'test@gmail.com',
      password: 'short',
      personalInfo: {
        firstName: 'Test',
        lastName: 'User',
        phone: '+966511111111',
      },
      companyInfo: {},
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing personalInfo', () => {
    const result = newCRMUserInfoSchema.safeParse({
      email: 'test@gmail.com',
      password: 'password123',
      companyInfo: {},
    });
    expect(result.success).toBe(false);
  });

  it('requires companyInfo object even if empty', () => {
    const result = newCRMUserInfoSchema.safeParse({
      email: 'test@gmail.com',
      password: 'password123',
      personalInfo: {
        firstName: 'Test',
        lastName: 'User',
        phone: '+966511111111',
      },
    });
    expect(result.success).toBe(false);
  });
});
