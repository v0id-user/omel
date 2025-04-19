'use client';

import { Check } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { OButton } from '@/components/omel/Button';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { motion } from 'motion/react';

const SaudiRiyal = ({ className = '', size = 0.8 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1124.14 1256.39"
    className={`inline-block ${className}`}
    style={{ width: `${size}em`, height: `${size}em`, verticalAlign: 'middle' }}
  >
    <path
      fill="currentColor"
      d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
    />
    <path
      fill="currentColor"
      d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
    />
  </svg>
);

interface PricingPlan {
  name: string;
  price: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  cta: string;
  highlighted: boolean;
}

const formatPrice = (price: number): string => {
  if (price === 0) return '0';

  // For prices >= 1000, format with commas and no decimals
  if (price >= 1000) {
    return Math.ceil(price).toLocaleString('en-US');
  }

  // For smaller prices, round up to .99
  return (Math.ceil(price) - 0.01).toFixed(2);
};

const calculateYearlyPrice = (monthlyPrice: number): string => {
  if (monthlyPrice === 0) return '0';
  const yearlyTotal = monthlyPrice * 12;
  const discountedPrice = yearlyTotal * 0.8; // 20% off
  return formatPrice(discountedPrice);
};

const basePricingPlans = [
  {
    name: 'مجاني',
    monthlyPrice: 0,
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
    monthlyPrice: 29.96,
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
    monthlyPrice: 1499,
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

const pricingPlans: PricingPlan[] = basePricingPlans.map(plan => ({
  ...plan,
  price: {
    monthly: plan.monthlyPrice === 0 ? '0' : formatPrice(plan.monthlyPrice),
    yearly: calculateYearlyPrice(plan.monthlyPrice),
  },
}));

type BillingPeriod = 'monthly' | 'yearly';

export const PricingCard = ({
  plan,
  visibleItems,
  index,
  billingPeriod,
}: {
  plan: PricingPlan;
  visibleItems: number[];
  index: number;
  billingPeriod: BillingPeriod;
}) => {
  return (
    <div
      className={`relative rounded-xl border ${plan.highlighted ? 'bg-white relative z-10 scale-105 md:translate-y-[-10px]' : 'border-border bg-white'} p-6 transition-all duration-500 ease-out ${
        visibleItems.includes(index) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <GlowingEffect spread={70} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
      {plan.highlighted && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 -translate-y-1/2 translate-x-1/4 rounded-full">
          الأكثر شعبية
        </div>
      )}
      <div className="relative flex flex-col justify-between h-full">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">{plan.name}</h3>
        </div>
        <div className="mb-6">
          {!plan.highlighted ? (
            <>
              <motion.span
                key={`${plan.name}-${billingPeriod}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold"
              >
                {plan.price[billingPeriod]}
              </motion.span>

              <span className="text-muted-foreground text-sm">
                {' '}
                <SaudiRiyal size={1} /> / {billingPeriod === 'monthly' ? 'شهرياً' : 'سنوياً'}
              </span>
            </>
          ) : (
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-end gap-2">
                <motion.span
                  key={`${plan.name}-${billingPeriod}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold"
                >
                  {plan.price[billingPeriod]}
                </motion.span>
                <span className="text-muted-foreground text-sm mb-1">
                  {' '}
                  <SaudiRiyal size={1} /> / {billingPeriod === 'monthly' ? 'شهرياً' : 'سنوياً'}
                </span>
              </div>
              <span className="text-emerald-600 bg-emerald-50 ring-1 ring-emerald-500/20 rounded-full px-3 py-1 text-[11px] font-medium opacity-65">
                ⚡️ سعر حصري لفترة محدودة
              </span>
            </div>
          )}
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
  );
};

const Pricing = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
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
        {/** Pricing Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">خطط الأسعار</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            اختر الخطة المناسبة لاحتياجات عملك. جميع الخطط تشمل تحديثات مجانية
          </p>

          {/* Billing Period Toggle */}
          <div className="flex justify-center mb-8">
            <div className="relative bg-gray-100 rounded-xl p-1.5 inline-flex min-w-[240px]">
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`relative z-10 px-4 py-2 text-sm rounded-xl transition-colors duration-200 flex-1 text-center ${
                  billingPeriod === 'yearly' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                سنوي
                {billingPeriod === 'yearly' && (
                  <motion.span
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-3 right-0 translate-x-1/2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full whitespace-nowrap"
                  >
                    خصم 20%
                  </motion.span>
                )}
              </button>
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`relative z-10 px-4 py-2 text-sm rounded-xl transition-colors duration-200 flex-1 text-center ${
                  billingPeriod === 'monthly' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                شهري
              </button>
              <motion.div
                className="absolute inset-1.5 isolate inline-flex items-center justify-center overflow-hidden text-left font-medium rounded-lg shadow-[0_1px_rgba(255,255,255,0.07)_inset,0_1px_3px_rgba(0,0,0,0.2)] ring-1 bg-[#010103] text-[#f3f4f6] ring-[#6c7688] text-sm py-2 px-4 before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-gradient-to-b before:from-white/20 before:opacity-50 hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-lg after:bg-gradient-to-b after:from-white/10 after:from-[46%] after:to-[54%] after:mix-blend-overlay hover:drop-shadow-2xs"
                initial={false}
                animate={{
                  x: billingPeriod === 'yearly' ? 0 : '-100%',
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                style={{
                  width: 'calc(50% - 6px)',
                }}
              />
            </div>
          </div>
        </div>

        {/** Pricing Cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 ring-1 ring-gray-300/40 px-14 py-10">
          {/* Top left corner cross */}
          <div className="absolute -top-3 -left-3 flex items-center justify-center">
            {/* <div className="absolute w-8 h-[1px] bg-gradient-to-r from-gray-300/40 to-transparent"></div>
            <div className="absolute w-[1px] h-8 bg-gradient-to-b from-gray-300/40 to-transparent"></div>
             */}
            {/* <div className="text-gray-500/40 text-xs bg-white w-6 h-6 flex items-center justify-center">
              *
            </div> */}
          </div>
          {/* Top right corner cross */}
          <div className="absolute -top-3 -right-3 flex items-center justify-center">
            <div className="absolute w-8 h-[1px] bg-gradient-to-l from-gray-300/40 to-transparent"></div>
            <div className="absolute w-[1px] h-8 bg-gradient-to-b from-gray-300/40 to-transparent"></div>
            <div className="text-gray-500/40 text-xs bg-white w-6 h-6 flex items-center justify-center">
              +
            </div>
          </div>
          {/* Bottom left corner cross */}
          <div className="absolute -bottom-3 -left-3 flex items-center justify-center">
            <div className="absolute w-8 h-[1px] bg-gradient-to-r from-gray-300/40 to-transparent"></div>
            <div className="absolute w-[1px] h-8 bg-gradient-to-t from-gray-300/40 to-transparent"></div>
            <div className="text-gray-500/40 text-xs bg-white w-6 h-6 flex items-center justify-center">
              +
            </div>
          </div>
          {/* Bottom right corner cross */}
          <div className="absolute -bottom-3 -right-3 flex items-center justify-center">
            {/* <div className="absolute w-8 h-[1px] bg-gradient-to-l from-gray-300/40 to-transparent"></div>
            <div className="absolute w-[1px] h-8 bg-gradient-to-t from-gray-300/40 to-transparent"></div>
             */}
            {/* <div className="text-gray-500/40 text-xs bg-white w-6 h-6 flex items-center justify-center">
              *
            </div> */}
          </div>

          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              visibleItems={visibleItems}
              index={index}
              billingPeriod={billingPeriod}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
