import { describe, it, expect } from 'bun:test';
import { mapSignInErrorToArabic } from '@/lib/betterauth/auth-errors';

describe('mapSignInErrorToArabic', () => {
  describe('when error is null or undefined', () => {
    it('returns generic fallback for null', () => {
      expect(mapSignInErrorToArabic(null)).toBe('خطأ في تسجيل الدخول');
    });

    it('returns generic fallback for undefined', () => {
      expect(mapSignInErrorToArabic(undefined)).toBe('خطأ في تسجيل الدخول');
    });
  });

  describe('when status is 429', () => {
    it('returns rate limit message', () => {
      expect(mapSignInErrorToArabic({ status: 429 })).toBe('محاولات كثيرة، يرجى المحاولة لاحقاً');
    });

    it('takes precedence over message', () => {
      expect(mapSignInErrorToArabic({ message: 'Invalid password', status: 429 })).toBe(
        'محاولات كثيرة، يرجى المحاولة لاحقاً'
      );
    });
  });

  describe('when code is email_not_found', () => {
    it('returns email not registered message', () => {
      expect(mapSignInErrorToArabic({ code: 'email_not_found' })).toBe(
        'البريد الإلكتروني غير مسجل'
      );
    });

    it('takes precedence over message when status is not 429', () => {
      expect(
        mapSignInErrorToArabic({
          message: 'Invalid password',
          code: 'email_not_found',
        })
      ).toBe('البريد الإلكتروني غير مسجل');
    });
  });

  describe('when message contains invalid password', () => {
    it('returns wrong password message for exact match', () => {
      expect(mapSignInErrorToArabic({ message: 'Invalid password' })).toBe('كلمة المرور غير صحيحة');
    });

    it('is case-insensitive', () => {
      expect(mapSignInErrorToArabic({ message: 'INVALID PASSWORD' })).toBe('كلمة المرور غير صحيحة');
      expect(mapSignInErrorToArabic({ message: 'invalid password' })).toBe('كلمة المرور غير صحيحة');
    });
  });

  describe('when message indicates invalid credentials or user/email not found', () => {
    it('returns credentials message for invalid credentials', () => {
      expect(mapSignInErrorToArabic({ message: 'Invalid credentials' })).toBe(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      );
    });

    it('returns credentials message for email not found', () => {
      expect(mapSignInErrorToArabic({ message: 'email not found' })).toBe(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      );
    });

    it('returns credentials message for user not found', () => {
      expect(mapSignInErrorToArabic({ message: 'user not found' })).toBe(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      );
    });

    it('is case-insensitive', () => {
      expect(mapSignInErrorToArabic({ message: 'EMAIL NOT FOUND' })).toBe(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      );
    });
  });

  describe('when no known pattern matches', () => {
    it('returns generic fallback for empty error object', () => {
      expect(mapSignInErrorToArabic({})).toBe('خطأ في تسجيل الدخول');
    });

    it('returns generic fallback for unknown message', () => {
      expect(mapSignInErrorToArabic({ message: 'Something went wrong' })).toBe(
        'خطأ في تسجيل الدخول'
      );
    });

    it('returns generic fallback for 401 without recognizable message', () => {
      expect(mapSignInErrorToArabic({ status: 401, message: 'Unauthorized' })).toBe(
        'خطأ في تسجيل الدخول'
      );
    });
  });
});
