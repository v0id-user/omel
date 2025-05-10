'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { OButton } from '@/components/omel/Button';
import { useRouter } from 'next/navigation';
import Banner from '@/public/banner.svg';
const useScrollEffect = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrolled;
};
const useAnchorNavigation = (
  setIsOpen: (isOpen: boolean) => void,
  router: ReturnType<typeof useRouter>
) => {
  return (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (href.startsWith('#')) {
      const targetElement = document.querySelector(href);
      targetElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      router.push(href);
    }
  };
};

const NavLink = ({
  href,
  children,
  onClick,
  className,
}: {
  href: string;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  className?: string;
}) => (
  <a
    href={href}
    className={`text-foreground/70 hover:text-foreground transition-colors ${className}`}
    onClick={e => onClick(e, href)}
  >
    {children}
  </a>
);

const MobileMenu = ({
  isOpen,
  handleAnchorClick,
}: {
  isOpen: boolean;
  handleAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed top-[calc(1rem+3.5rem)] right-4 left-4 bg-white border border-border rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 z-[999]">
      <div className="p-6 flex flex-col space-y-6">
        <NavLink href="#features" onClick={handleAnchorClick} className="py-2 text-lg text-center">
          المميزات
        </NavLink>
        <NavLink
          href="#testimonials"
          onClick={handleAnchorClick}
          className="py-2 text-lg text-center"
        >
          آراء العملاء
        </NavLink>
        <NavLink href="#pricing" onClick={handleAnchorClick} className="py-2 text-lg text-center">
          الأسعار
        </NavLink>
        <NavLink href="#contact" onClick={handleAnchorClick} className="py-2 text-lg text-center">
          تواصل معنا
        </NavLink>
        <OButton onClick={() => router.push('/sign-in')} className="w-full">
          تسجيل الدخول
        </OButton>
      </div>
    </div>
  );
};

const DesktopMenu = ({
  handleAnchorClick,
}: {
  handleAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) => {
  const router = useRouter();

  return (
    <>
      <div className="hidden md:flex space-x-6 space-x-reverse">
        <NavLink href="#features" onClick={handleAnchorClick} className="text-sm">
          المميزات
        </NavLink>
        <NavLink href="#testimonials" onClick={handleAnchorClick} className="text-sm">
          آراء العملاء
        </NavLink>
        <NavLink href="#pricing" onClick={handleAnchorClick} className="text-sm">
          الأسعار
        </NavLink>
        <NavLink href="#contact" onClick={handleAnchorClick} className="text-sm">
          تواصل معنا
        </NavLink>
        <NavLink href="#empty" onClick={handleAnchorClick} className="text-sm">
          {' ' /*Empty */}
        </NavLink>
      </div>
      <div className="hidden md:block">
        <OButton onClick={() => router.push('/sign-in')}>تسجيل الدخول</OButton>
      </div>
    </>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrollEffect();
  const router = useRouter();
  const handleAnchorClick = useAnchorNavigation(setIsOpen, router);

  return (
    <nav
      className={`fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-[999] transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg rounded-xl' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center gap-4 md:gap-8 px-4 py-2 md:px-8 md:py-3 max-w-[1200px] mx-auto">
        <Banner className="w-fit h-fit" />

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

        <DesktopMenu handleAnchorClick={handleAnchorClick} />
      </div>

      <MobileMenu isOpen={isOpen} handleAnchorClick={handleAnchorClick} />
    </nav>
  );
};

export default Navbar;
