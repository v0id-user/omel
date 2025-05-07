'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { OButton } from '@/components/omel/Button';
import { useRouter } from 'next/navigation';
import Banner from '@/public/banner.svg';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle smooth scrolling for anchor links
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    // If it's an anchor link
    if (href.startsWith('#')) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        // Smooth scroll to the element
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } else {
      // For non-anchor links
      router.push(href);
    }
  };

  return (
    <nav
      className={`py-4 sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}
    >
      <div className="container-custom flex justify-between items-center">
        <Banner className="w-fit h-fit" />

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            className="text-foreground"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 space-x-reverse">
          <a
            href="#features"
            className="text-foreground/70 text-sm hover:text-foreground transition-colors"
            onClick={e => handleAnchorClick(e, '#features')}
          >
            المميزات
          </a>
          <a
            href="#testimonials"
            className="text-foreground/70 text-sm hover:text-foreground transition-colors"
            onClick={e => handleAnchorClick(e, '#testimonials')}
          >
            آراء العملاء
          </a>
          <a
            href="#pricing"
            className="text-foreground/70 text-sm hover:text-foreground transition-colors"
            onClick={e => handleAnchorClick(e, '#pricing')}
          >
            الأسعار
          </a>
          <a
            href="#contact"
            className="text-foreground/70 text-sm hover:text-foreground transition-colors"
            onClick={e => handleAnchorClick(e, '#contact')}
          >
            تواصل معنا
          </a>
          <a
            href="#contact"
            className="text-foreground/70 text-sm hover:text-foreground transition-colors"
            onClick={e => handleAnchorClick(e, '#contact')}
          >
            {' ' /*Empty */}
          </a>
        </div>

        <div className="hidden md:block">
          <OButton onClick={() => router.push('/sign-in')}>تسجيل الدخول</OButton>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 right-0 left-0 bg-background border-b border-border rounded-xl shadow-sm animate-fade-in">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <a
              href="#features"
              className="text-foreground/70 hover:text-foreground py-2"
              onClick={e => handleAnchorClick(e, '#features')}
            >
              المميزات
            </a>
            <a
              href="#testimonials"
              className="text-foreground/70 hover:text-foreground py-2"
              onClick={e => handleAnchorClick(e, '#testimonials')}
            >
              آراء العملاء
            </a>
            <a
              href="#pricing"
              className="text-foreground/70 hover:text-foreground py-2"
              onClick={e => handleAnchorClick(e, '#pricing')}
            >
              الأسعار
            </a>
            <a
              href="#contact"
              className="text-foreground/70 hover:text-foreground py-2"
              onClick={e => handleAnchorClick(e, '#contact')}
            >
              تواصل معنا
            </a>
            <OButton onClick={() => router.push('/sign-in')}>تسجيل الدخول</OButton>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
