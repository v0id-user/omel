import { describe, it, expect } from 'bun:test';
import { toArabicNumerals, toEnglishNumerals } from '@/utils/index';

describe('toArabicNumerals', () => {
  it('converts single digit numbers', () => {
    expect(toArabicNumerals(0)).toBe('٠');
    expect(toArabicNumerals(5)).toBe('٥');
    expect(toArabicNumerals(9)).toBe('٩');
  });

  it('converts multi-digit numbers', () => {
    expect(toArabicNumerals(123)).toBe('١٢٣');
    expect(toArabicNumerals(9876)).toBe('٩٨٧٦');
  });

  it('converts string input', () => {
    expect(toArabicNumerals('42')).toBe('٤٢');
    expect(toArabicNumerals('007')).toBe('٠٠٧');
  });

  it('handles empty string', () => {
    expect(toArabicNumerals('')).toBe('');
  });

  it('preserves non-digit characters', () => {
    expect(toArabicNumerals('100%')).toBe('١٠٠%');
    expect(toArabicNumerals('3.14')).toBe('٣.١٤');
  });
});

describe('toEnglishNumerals', () => {
  it('converts single eastern-arabic digits', () => {
    expect(toEnglishNumerals('٠')).toBe('0');
    expect(toEnglishNumerals('٥')).toBe('5');
    expect(toEnglishNumerals('٩')).toBe('9');
  });

  it('converts multi-digit eastern-arabic strings', () => {
    expect(toEnglishNumerals('١٢٣')).toBe('123');
    expect(toEnglishNumerals('٩٨٧٦')).toBe('9876');
  });

  it('handles empty string', () => {
    expect(toEnglishNumerals('')).toBe('');
  });

  it('preserves non-arabic-numeral characters', () => {
    expect(toEnglishNumerals('١٠٠%')).toBe('100%');
    expect(toEnglishNumerals('٣.١٤')).toBe('3.14');
  });

  it('leaves western digits untouched', () => {
    expect(toEnglishNumerals('abc123')).toBe('abc123');
  });
});

describe('round-trip conversion', () => {
  it('toEnglishNumerals(toArabicNumerals(n)) returns original string', () => {
    const values = ['0', '1', '42', '999', '1234567890'];
    for (const v of values) {
      expect(toEnglishNumerals(toArabicNumerals(v))).toBe(v);
    }
  });
});
