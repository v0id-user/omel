'use client';
import { useState, useEffect } from 'react';
import { OButton } from '@/components/omel/Button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Use a slight delay to ensure smoother appearance after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ willChange: 'transform, opacity' }}
          >
            منصة إدارة علاقات العملاء المتطورة للشركات العربية
          </h1>
          <p
            className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-200 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ willChange: 'transform, opacity' }}
          >
            أداة بسيطة وفعالة لإدارة علاقاتك مع العملاء وتحسين أداء فريقك وزيادة مبيعاتك
          </p>
          <div
            className={`flex flex-col sm:flex-row justify-center gap-4 pt-4 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ willChange: 'transform, opacity' }}
          >
            <OButton
              onClick={() => router.push('/sign-up')}
              className="flex items-center gap-2 px-4 group"
            >
              <ArrowRight className="w-4 h-4 text-white group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300 ease-out" />
              ابدأ الآن مجاناً
            </OButton>
            <OButton variant="ghost" className="ring-1 ring-gray-300">
              طلب عرض توضيحي
            </OButton>
          </div>
        </div>

        <div
          className={`mt-16 relative max-w-5xl mx-auto transition-all duration-1000 delay-400 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="bg-gradient-to-b from-background to-secondary rounded-xl overflow-hidden border border-border shadow-lg aspect-video">
            <div className="flex items-center justify-center h-full">
              <div className="text-lg font-medium text-foreground/50">واجهة أوميل CRM</div>
            </div>
          </div>
          <div className="absolute inset-0 border border-border rounded-xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
