import { describe, it, expect } from '@jest/globals';
import { POST } from '@/app/api/onboarding/route';
import { NextRequest } from 'next/server';
import { Onboarding } from '@/interfaces/onboarding';
describe('Onboarding test', () => {
  it('should create a crm details', async () => {
    const onboarding: Onboarding = {
      companyName: 'Test Company',
      companyIndustry: 'Test Industry',
      companySize: 10,
      companyLocation: 'Test Location',
      companyDescription: 'Test Description',
      companyLogo: 'test-logo.png',
      companyBanner: 'test-banner.png',
      authorUserId: 'test-user-id',
      companyWebsite: 'Test Website',
    };

    const request = new NextRequest('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(onboarding),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toContain('ok');
  });
});
