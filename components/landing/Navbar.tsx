'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { OButton } from '@/components/omel/Button';
import { useRouter, usePathname } from 'next/navigation';
import Banner from '@/public/banner.svg';

const useScrollEffect = (disableEffect = false) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (disableEffect) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [disableEffect]);

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-2 mx-2 bg-white border border-border rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 z-[999]">
      <div className="p-6 flex flex-col space-y-4">
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
      <div className="hidden md:flex items-center gap-6">
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
      </div>
      <div className="hidden md:block">
        <OButton onClick={() => router.push('/sign-in')}>تسجيل الدخول</OButton>
      </div>
    </>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLegalPage = pathname?.startsWith('/legal');
  const scrolled = useScrollEffect(isLegalPage);
  const handleAnchorClick = useAnchorNavigation(setIsOpen, router);

  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <nav
      className={`fixed z-[999] transition-all duration-300 ${
        isLegalPage
          ? 'top-0 inset-x-0 bg-white shadow-md'
          : scrolled
            ? 'top-4 inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-[1200px] bg-white/90 backdrop-blur-md shadow-lg rounded-xl'
            : 'top-4 inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-[1200px] bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center gap-4 md:gap-8 px-4 py-2 md:px-8 md:py-3 max-w-[1200px] mx-auto">
        <Banner className="w-fit h-fit shrink-0" />

        <DesktopMenu handleAnchorClick={handleAnchorClick} />

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
      </div>

      <MobileMenu isOpen={isOpen} handleAnchorClick={handleAnchorClick} />
    </nav>
  );
};

export default Navbar;
