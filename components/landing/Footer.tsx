'use client';
import { Input } from '@/components/ui/input';
import { OButton } from '@/components/omel/Button';

const Footer = () => {
  return (
    <footer className="bg-secondary px-5 rounded-t-4xl">
      <div className="container-custom pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="text-xl font-semibold mb-3">أوميل</div>
            <p className="text-muted-foreground text-sm mb-5">
              نظام إدارة علاقات العملاء الأمثل للشركات العربية. سهل الاستخدام. فعّال. موثوق.
            </p>
            <div className="flex space-x-3 space-x-reverse">
              <a
                href="https://www.x.com/omel_crm"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 300 271"
                  fill="currentColor"
                >
                  <path d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/omel-crm"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" fillRule="evenodd">
                    <path
                      d="M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z"
                      fill="currentColor"
                    />
                    <path
                      d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z"
                      fill="#FFFFFF"
                    />
                  </g>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {' ' /*Empty */}
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">روابط سريعة</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  الرئيسية
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  المميزات
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  آراء العملاء
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  الأسعار
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">الدعم</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  المساعدة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  قاعدة المعرفة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  المدونة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  تواصل مع الدعم
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">النشرة البريدية</h3>
            <p className="text-muted-foreground text-sm mb-3">
              اشترك في نشرتنا البريدية للحصول على أحدث الأخبار والتحديثات
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="بريدك الإلكتروني" className="bg-white text-sm rounded-md" />
              <OButton className="bg-primary text-primary-foreground whitespace-nowrap rounded-md">
                اشتراك
              </OButton>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-5 text-center text-muted-foreground text-xs">
          <p>© {new Date().getFullYear()} أوميل. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
