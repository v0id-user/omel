import { NextRequest, NextResponse } from 'next/server';
import { Onboarding } from '@/interfaces/onboarding';
export async function POST(request: NextRequest) {
  const { onboarding }: { onboarding: Onboarding } = await request.json();
  console.log(onboarding);
  return NextResponse.json({ message: 'User created' });
}
