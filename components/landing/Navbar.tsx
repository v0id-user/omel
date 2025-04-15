import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <nav
      className={`py-4 sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}
    >
      <div className="container-custom flex justify-between items-center">
        <div className="text-xl font-semibold">أوميل</div>

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
          >
            المميزات
          </a>
          <a
            href="#testimonials"
            className="text-foreground/70 text-sm hover:text-foreground transition-colors"
          >
            آراء العملاء
          </a>
          <a
            href="#pricing"
            className="text-foreground/70 text-sm hover:text-foreground transition-colors"
          >
            الأسعار
          </a>
          <a
            href="#contact"
            className="text-foreground/70 text-sm hover:text-foreground transition-colors"
          >
            تواصل معنا
          </a>
        </div>

        <div className="hidden md:block">
          <Button className="rounded-full">تسجيل الدخول</Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 right-0 left-0 bg-background border-b border-border animate-fade-in">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <a
              href="#features"
              className="text-foreground/70 hover:text-foreground py-2"
              onClick={() => setIsOpen(false)}
            >
              المميزات
            </a>
            <a
              href="#testimonials"
              className="text-foreground/70 hover:text-foreground py-2"
              onClick={() => setIsOpen(false)}
            >
              آراء العملاء
            </a>
            <a
              href="#pricing"
              className="text-foreground/70 hover:text-foreground py-2"
              onClick={() => setIsOpen(false)}
            >
              الأسعار
            </a>
            <a
              href="#contact"
              className="text-foreground/70 hover:text-foreground py-2"
              onClick={() => setIsOpen(false)}
            >
              تواصل معنا
            </a>
            <Button className="rounded-full">تسجيل الدخول</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
