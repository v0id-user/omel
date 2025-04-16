import Navbar from '@/components/landing/Navbar';

import Footer from '@/components/landing/Footer';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen inset-0 .legal-container">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
