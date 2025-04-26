import { redirect } from 'next/navigation';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'أوميل - تجارب',
  description: 'تجارب للتطبيقات المختلفة',
};

export default function TestsLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_ENV !== 'dev') {
    redirect('/');
  }

  return <div>{children}</div>;
}
