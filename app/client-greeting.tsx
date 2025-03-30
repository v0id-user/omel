'use client';
import { trpc } from '@/trpc/client';

export function ClientGreeting() {
  const [data] = trpc.hello.useSuspenseQuery({ text: 'Testing TRPC' });
  return <div>{data.greeting}</div>;
}
