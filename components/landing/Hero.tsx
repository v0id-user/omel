import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            منصة إدارة علاقات العملاء المتطورة للشركات العربية
          </h1>
          <p
            className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            أداة بسيطة وفعالة لإدارة علاقاتك مع العملاء وتحسين أداء فريقك وزيادة مبيعاتك
          </p>
          <div
            className={`flex flex-col sm:flex-row justify-center gap-4 pt-4 transition-all duration-700 delay-200 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <Button size="lg" className="rounded-full">
              ابدأ الآن مجاناً
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              طلب عرض توضيحي
            </Button>
          </div>
        </div>

        <div
          className={`mt-16 relative max-w-5xl mx-auto transition-all duration-700 delay-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
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
