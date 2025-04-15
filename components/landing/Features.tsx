import { Users, BarChart, MessageSquare, Calendar, Mail, PieChart } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const featuresList = [
  {
    icon: <Users className="h-6 w-6" />,
    title: 'إدارة العملاء',
    description: 'تتبع معلومات وتفاعلات العملاء في مكان واحد مع تصنيف ذكي وتقارير مفصلة',
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: 'تحليل المبيعات',
    description: 'رؤية شاملة لأداء المبيعات مع تقارير تفاعلية وإحصائيات دقيقة',
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'تواصل متكامل',
    description: 'التواصل مع العملاء عبر قنوات متعددة من منصة واحدة',
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'جدولة المهام',
    description: 'تنظيم المواعيد والمهام بكفاءة مع تذكيرات آلية',
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: 'حملات تسويقية',
    description: 'إنشاء وإدارة حملات البريد الإلكتروني مع تتبع النتائج',
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: 'لوحة تحكم ذكية',
    description: 'رؤية شاملة لجميع أنشطة الأعمال مع تقارير قابلة للتخصيص',
  },
];

const Features = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          const timer = setTimeout(() => {
            const visibleIndices = Array.from({ length: featuresList.length }, (_, i) => i);
            setVisibleItems(visibleIndices);
          }, 100);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
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

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container-custom" ref={featuresRef}>
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">المميزات الرئيسية</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            تقدم منصة أوميل CRM مجموعة متكاملة من الأدوات المصممة خصيصاً للشركات العربية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border border-border bg-white transition-all duration-500 ease-out ${
                visibleItems.includes(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-primary/5 text-primary p-3 inline-block rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
