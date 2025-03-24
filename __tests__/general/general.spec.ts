import { describe, it, expect } from '@jest/globals';

describe('Example Test Suite', () => {
  it('should print current file name', () => {
    console.log('Current file: tests/general/general.spec.ts');
    expect('tests/general/general.spec.ts').toBeTruthy();
  });

  it('should add two numbers correctly', () => {
    const a = 2;
    const b = 3;

    const result = a + b;

    expect(result).toBe(5);
  });

  it('should concatenate two strings', () => {
    const str1 = 'Hello';
    const str2 = 'World';

    const result = `${str1} ${str2}`;

    expect(result).toBe('Hello World');
  });
});
