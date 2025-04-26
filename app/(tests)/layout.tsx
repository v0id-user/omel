import { redirect } from 'next/navigation';

export default function TestsLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_ENV !== 'dev') {
    redirect('/');
  }

  return <div>{children}</div>;
}
