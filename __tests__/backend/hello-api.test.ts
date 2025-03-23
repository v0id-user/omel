import { GET } from '@/app/api/hello/route';
import { describe, it, expect } from '@jest/globals';

describe('Hello API Route', () => {
  it('should return the correct json response', async () => {
    const response = await GET();
    if (!response) {
      throw new Error('Response is undefined');
    }
    const data = await response.json();
    console.log(data);
    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'Hello World' });
  });
});
