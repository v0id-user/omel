import { Users, BarChart, MessageSquare, Calendar, Mail, PieChart } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { BentoGrid, BentoCard } from '@/components/magicui/bento-grid';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';

const featuresList = [
  {
    icon: <Users className="h-6 w-6" />,
    title: 'إدارة العملاء',
    description: 'تتبع معلومات وتفاعلات العملاء في مكان واحد مع تصنيف ذكي وتقارير مفصلة',
    className: 'md:col-span-2 lg:col-span-2',
    href: '#',
    cta: 'المزيد',
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: 'تحليل المبيعات',
    description: 'رؤية شاملة لأداء المبيعات مع تقارير تفاعلية وإحصائيات دقيقة',
    className: 'md:col-span-1 lg:col-span-1',
    href: '#',
    cta: 'المزيد',
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'تواصل متكامل',
    description: 'التواصل مع العملاء عبر قنوات متعددة من منصة واحدة',
    className: 'md:col-span-1 lg:col-span-1',
    href: '#',
    cta: 'المزيد',
    background: (
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full opacity-20"
        squareSize={4}
        gridGap={6}
        color="#000"
        maxOpacity={0.3}
        flickerChance={0.1}
      />
    ),
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'جدولة المهام',
    description: 'تنظيم المواعيد والمهام بكفاءة مع تذكيرات آلية',
    className: 'md:col-span-1 lg:col-span-1',
    href: '#',
    cta: 'المزيد',
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: 'حملات تسويقية',
    description: 'إنشاء وإدارة حملات البريد الإلكتروني مع تتبع النتائج',
    className: 'md:col-span-1 lg:col-span-2',
    href: '#',
    cta: 'المزيد',
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: 'لوحة تحكم ذكية',
    description: 'رؤية شاملة لجميع أنشطة الأعمال مع تقارير قابلة للتخصيص',
    className: 'md:col-span-2 lg:col-span-1',
    href: '#',
    cta: 'المزيد',
  },
];

const Features = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          // Stagger the animations
          featuresList.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => [...prev, index]);
            }, index * 120); // Staggered delay for butter-smooth appearance
          });
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    const currentRef = featuresRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const bentoFeatures = featuresList.map((feature, index) => ({
    Icon: function FeatureIcon() {
      return feature.icon;
    },
    name: feature.title,
    description: feature.description,
    className: `${feature.className} ${visibleItems.includes(index) ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`,
    background: feature.background,
    href: feature.href,
    cta: feature.cta,
    style: {
      transitionDelay: `${index * 120}ms`,
      minHeight: index === 0 ? '220px' : '180px',
      willChange: 'transform, opacity, scale',
    },
  }));

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container-custom" ref={featuresRef}>
        <div
          className="text-center mb-14 transition-opacity duration-700 ease-out"
          style={{ opacity: visibleItems.length > 0 ? 1 : 0 }}
        >
          <h2 className="text-3xl font-bold mb-4">المميزات الرئيسية</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            تقدم منصة أوميل CRM مجموعة متكاملة من الأدوات المصممة خصيصاً للشركات العربية
          </p>
        </div>

        <BentoGrid className="grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bentoFeatures.map((feature, index) => (
            <BentoCard
              key={index}
              Icon={feature.Icon}
              name={feature.name}
              description={feature.description}
              background={feature.background}
              href={feature.href}
              cta={feature.cta}
              className={`p-6 rounded-xl border border-border bg-white transition-all duration-800 ease-out ${feature.className}`}
              style={feature.style}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default Features;
