import Navbar from '@/components/landing/Navbar';

import Footer from '@/components/landing/Footer';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen inset-0">
      <Navbar />
      <div className="legal-container flex flex-col-reverse md:flex-row-reverse gap-y-8 gap-x-4 md:gap-x-8 lg:gap-x-15 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </div>
      <Footer />
    </div>
  );
}
