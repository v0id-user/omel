'use client';

import { Check } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { OButton } from '@/components/omel/Button';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const pricingPlans = [
  {
    name: 'أساسي',
    price: '99',
    features: [
      'حتى 1,000 جهة اتصال',
      'إدارة فريق من 5 مستخدمين',
      'وصول للتقارير الأساسية',
      'دعم عبر البريد الإلكتروني',
      'تخزين سحابي 5GB',
    ],
    cta: 'ابدأ الآن',
    highlighted: false,
  },
  {
    name: 'احترافي',
    price: '249',
    features: [
      'حتى 10,000 جهة اتصال',
      'إدارة فريق من 15 مستخدمين',
      'تقارير متقدمة وتحليلات',
      'دعم على مدار الساعة',
      'تخزين سحابي 25GB',
      'حملات تسويقية متقدمة',
      'تكامل مع تطبيقات خارجية',
    ],
    cta: 'جرب مجاناً لمدة 14 يوم',
    highlighted: true,
  },
  {
    name: 'المؤسسات',
    price: '499',
    features: [
      'جهات اتصال غير محدودة',
      'مستخدمين غير محدودين',
      'تقارير مخصصة وتحليلات متقدمة',
      'مدير حساب مخصص',
      'تخزين سحابي 100GB',
      'أتمتة العمليات التسويقية',
      'تكامل مع جميع الأنظمة',
      'تدريب وإعداد مخصص',
    ],
    cta: 'تواصل معنا',
    highlighted: false,
  },
];

const Pricing = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          const timer = setTimeout(() => {
            const visibleIndices = Array.from({ length: pricingPlans.length }, (_, i) => i);
            setVisibleItems(visibleIndices);
          }, 100);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = pricingRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container-custom" ref={pricingRef}>
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">خطط الأسعار</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            اختر الخطة المناسبة لاحتياجات عملك. جميع الخطط تشمل تحديثات مجانية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl border ${plan.highlighted ? 'bg-white relative z-10 scale-105 md:translate-y-[-10px]' : 'border-border bg-white'} p-6 transition-all duration-500 ease-out ${
                visibleItems.includes(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <GlowingEffect
                spread={70}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 -translate-y-1/2 translate-x-1/4 rounded-full">
                  الأكثر شعبية
                </div>
              )}
              <div className="relative flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm"> ريال / شهرياً</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 ml-2 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <OButton
                  className={`w-full ${plan.highlighted ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} rounded-full`}
                >
                  {plan.cta}
                </OButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
