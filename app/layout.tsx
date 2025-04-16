import type { Metadata } from 'next';
import './globals.css';
import { PostHogProvider } from './providers';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { TRPCProvider } from '@/trpc/client';
import { Toaster } from 'react-hot-toast';
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['arabic'],
});

export const metadata: Metadata = {
  title: 'أوميل - أداة إدارة علاقات العملاء',
  description: 'خذ تجربة خدمة العملاء المثالية مع أوميل.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body className={`antialiased ${ibmPlexSansArabic.className} bg-white`} dir="rtl">
        <TRPCProvider>
          <PostHogProvider>
            <Toaster />
            {children}
          </PostHogProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
