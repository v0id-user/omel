import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState, useRef } from 'react';

const testimonials = [
  {
    quote:
      'منصة أوميل ساعدتنا في زيادة مبيعاتنا بنسبة 35% خلال ثلاثة أشهر فقط. الواجهة سهلة الاستخدام والتقارير مفيدة جداً',
    name: 'أحمد محمد',
    title: 'مدير المبيعات، شركة التقنية المتطورة',
    avatar: 'أ',
  },
  {
    quote:
      'التكامل السلس مع أنظمتنا الحالية جعل الانتقال إلى أوميل CRM سهلاً للغاية. فريق الدعم ممتاز والاستجابة سريعة',
    name: 'سارة أحمد',
    title: 'مديرة تقنية المعلومات، مجموعة النور',
    avatar: 'س',
  },
  {
    quote:
      'نظام تحليل البيانات المتقدم ساعدنا في فهم سلوك العملاء بشكل أفضل واتخاذ قرارات مدروسة. استثمار ممتاز لشركتنا',
    name: 'خالد العلي',
    title: 'المدير التنفيذي، شركة السماء الزرقاء',
    avatar: 'خ',
  },
];

const Testimonials = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          const currentRef = testimonialsRef.current; // Store ref value
          const timer = setTimeout(() => {
            const visibleIndices = Array.from({ length: testimonials.length }, (_, i) => i);
            setVisibleItems(visibleIndices);
          }, 100);
          return () => {
            clearTimeout(timer);
            if (currentRef) {
              observer.unobserve(currentRef);
            }
          };
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = testimonialsRef.current;
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
    <section id="testimonials" className="py-20 bg-secondary/50">
      <div className="container-custom" ref={testimonialsRef}>
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">ماذا يقول عملاؤنا</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نفتخر بثقة المئات من الشركات العربية التي اختارت أوميل CRM
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 border border-border shadow-sm transition-all duration-500 ease-out ${
                visibleItems.includes(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <blockquote className="text-lg font-light italic mb-6 text-foreground/90">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 border border-border bg-secondary">
                  <AvatarFallback className="text-sm">{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div className="mr-3">
                  <div className="font-medium text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
