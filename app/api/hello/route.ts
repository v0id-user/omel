import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
    return NextResponse.json({ message: 'Hello World' });
  }
}
