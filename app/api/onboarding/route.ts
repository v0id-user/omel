import { NextRequest, NextResponse } from 'next/server';
import { Onboarding } from '@/interfaces/onboarding';
export async function POST(request: NextRequest) {
  const { onboarding }: { onboarding: Onboarding } = await request.json();
  console.log(onboarding);
  // TODO: Use interfaces for structure!
  return NextResponse.json({ status: 'ok' });
}
