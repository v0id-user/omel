import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { log } from '@/utils/logs/logs';

describe('log utility', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.NEXT_PUBLIC_ENV;
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_ENV = originalEnv;
  });

  it('returns formatted string in dev mode', () => {
    process.env.NEXT_PUBLIC_ENV = 'dev';
    const result = log({ component: 'TestComponent', message: 'hello' });
    expect(result).toContain('[TestComponent]');
    expect(result).toContain('[INFO]');
    expect(result).toContain('hello');
  });

  it('returns empty string in non-dev mode', () => {
    process.env.NEXT_PUBLIC_ENV = 'production';
    const result = log({ component: 'TestComponent', message: 'hello' });
    expect(result).toBe('');
  });

  it('includes data when provided', () => {
    process.env.NEXT_PUBLIC_ENV = 'dev';
    const result = log({
      component: 'TestComponent',
      message: 'with data',
      data: { key: 'value' },
    });
    expect(result).toContain('Data:');
    expect(result).toContain('"key"');
    expect(result).toContain('"value"');
  });

  it('respects level parameter', () => {
    process.env.NEXT_PUBLIC_ENV = 'dev';
    expect(log({ component: 'C', message: 'm', level: 'error' })).toContain('[ERROR]');
    expect(log({ component: 'C', message: 'm', level: 'warn' })).toContain('[WARN]');
    expect(log({ component: 'C', message: 'm', level: 'debug' })).toContain('[DEBUG]');
  });

  it('includes timestamp when flag is true', () => {
    process.env.NEXT_PUBLIC_ENV = 'dev';
    const result = log({
      component: 'C',
      message: 'm',
      timestamp: true,
    });
    expect(result).toMatch(/\[\d{4}-\d{2}-\d{2}/);
  });

  it('excludes timestamp by default', () => {
    process.env.NEXT_PUBLIC_ENV = 'dev';
    const result = log({ component: 'C', message: 'm' });
    expect(result).not.toMatch(/\[\d{4}-\d{2}-\d{2}/);
  });
});
