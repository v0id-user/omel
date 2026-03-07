import { describe, it, expect } from 'bun:test';
import { clientValidateEmailInput } from '@/utils/client/validators/email';
import { clientValidatePasswordInput } from '@/utils/client/validators/password';
import { validateWebsite } from '@/utils/client/validators/website';

describe('clientValidateEmailInput', () => {
  it('returns undefined for valid email', () => {
    expect(clientValidateEmailInput('user@example.com')).toBeUndefined();
  });

  it('returns undefined for complex valid email', () => {
    expect(clientValidateEmailInput('user+tag@sub.domain.com')).toBeUndefined();
  });

  it('returns error for empty string', () => {
    expect(clientValidateEmailInput('')).toBeDefined();
    expect(typeof clientValidateEmailInput('')).toBe('string');
  });

  it('returns error for invalid email format', () => {
    expect(clientValidateEmailInput('not-an-email')).toBeDefined();
    expect(clientValidateEmailInput('missing@')).toBeDefined();
    expect(clientValidateEmailInput('@nodomain.com')).toBeDefined();
  });
});

describe('clientValidatePasswordInput', () => {
  it('returns undefined for valid password (8+ chars)', () => {
    expect(clientValidatePasswordInput('password123')).toBeUndefined();
    expect(clientValidatePasswordInput('12345678')).toBeUndefined();
  });

  it('returns error for empty password', () => {
    expect(clientValidatePasswordInput('')).toBeDefined();
    expect(typeof clientValidatePasswordInput('')).toBe('string');
  });

  it('returns error for short password (< 8 chars)', () => {
    expect(clientValidatePasswordInput('short')).toBeDefined();
    expect(clientValidatePasswordInput('1234567')).toBeDefined();
  });

  it('accepts exactly 8 character password', () => {
    expect(clientValidatePasswordInput('abcdefgh')).toBeUndefined();
  });
});

describe('validateWebsite', () => {
  it('returns undefined for valid URLs', () => {
    expect(validateWebsite('https://example.com')).toBeUndefined();
    expect(validateWebsite('http://example.com')).toBeUndefined();
    expect(validateWebsite('https://sub.domain.com/path')).toBeUndefined();
  });

  it('returns undefined for URL without protocol', () => {
    expect(validateWebsite('example.com')).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(validateWebsite('')).toBeUndefined();
  });

  it('returns error for obviously invalid URLs', () => {
    expect(validateWebsite('not a url at all!')).toBeDefined();
  });
});
