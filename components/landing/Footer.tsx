'use client';

import { Input } from '@/components/ui/input';
import { OButton } from '@/components/omel/Button';
import { useEffect, useRef, useState } from 'react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = footerRef.current;
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
    <footer className="bg-secondary px-5 rounded-t-4xl" ref={footerRef}>
      <div
        className={`container-custom pt-12 pb-6 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className={`transition-all duration-700 delay-100 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <svg
              width="59"
              height="27"
              viewBox="0 0 701 327"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-xl mb-3"
            >
              <path
                d="M259.456 101.464L275.84 75.096L279.68 76.376V244.824L265.6 262.488L259.456 101.464ZM308.864 263C302.379 263 296.235 260.867 290.432 256.6C284.629 252.333 279.68 246.019 275.584 237.656C271.659 229.123 269.269 218.883 268.416 206.936L278.4 191.832C279.595 195.416 281.728 198.147 284.8 200.024C287.872 201.731 291.371 202.84 295.296 203.352C299.221 203.864 303.744 204.12 308.864 204.12C310.4 204.12 311.595 204.803 312.448 206.168C313.472 207.533 313.984 209.496 313.984 212.056V256.344C313.984 260.781 312.277 263 308.864 263ZM134.528 322.648C112.683 322.648 93.6533 319.917 77.44 314.456C61.2267 308.995 47.744 301.485 36.992 291.928C26.24 282.371 17.1947 271.107 9.856 258.136C5.76 249.432 3.2 240.557 2.176 231.512C1.152 222.296 1.23733 213.933 2.432 206.424H3.968C6.35733 213.08 9.17334 219.053 12.416 224.344C15.6587 229.635 19.4133 234.499 23.68 238.936C30.336 245.08 38.6133 250.541 48.512 255.32C58.5813 259.928 70.8693 263.512 85.376 266.072C99.8827 268.803 116.267 270.168 134.528 270.168C152.619 270.168 170.027 269.144 186.752 267.096C203.648 265.219 219.605 262.232 234.624 258.136C249.813 253.869 263.296 248.408 275.072 241.752L279.68 244.824L267.904 290.392C253.909 300.632 234.965 308.568 211.072 314.2C187.349 319.832 161.835 322.648 134.528 322.648ZM312.808 283.216L332.008 302.416V307.536L312.808 326.48L293.608 307.536V302.416L312.808 283.216ZM351.208 283.216L370.408 302.416V307.536L351.208 326.48L332.008 307.536V302.416L351.208 283.216ZM309 263C305.587 263 303.88 261.72 303.88 259.16V208.472C303.88 205.571 305.587 204.12 309 204.12C313.779 204.12 321.715 203.608 332.808 202.584C344.072 201.389 352.435 200.195 357.896 199L348.936 213.848L362.76 177.752L373.256 169.816L374.792 170.584L343.048 255.32C341.341 257.709 336.477 259.587 328.456 260.952C320.605 262.317 314.12 263 309 263ZM397.832 263C386.909 263 377.011 259.587 368.136 252.76C359.432 245.763 353.032 237.741 348.936 228.696L364.552 193.112C366.941 195.331 370.013 197.293 373.768 199C377.693 200.707 381.789 201.987 386.056 202.84C390.493 203.693 394.589 204.12 398.344 204.12C401.416 204.12 402.952 206.083 402.952 210.008V257.624C402.952 259.331 402.611 260.696 401.928 261.72C401.245 262.573 399.88 263 397.832 263ZM507.062 264.792C495.798 264.621 482.315 262.147 466.614 257.368C450.913 252.419 436.577 245.763 423.606 237.4L452.022 192.6C460.385 197.549 471.051 201.987 484.022 205.912C496.993 209.837 509.366 212.056 521.142 212.568V220.76C518.923 213.763 515.083 207.533 509.622 202.072C504.331 196.44 498.017 192.515 490.678 190.296C484.022 188.248 476.769 187.651 468.918 188.504C461.238 189.187 455.947 192.6 453.046 198.744C443.318 218.883 435.211 233.645 428.726 243.032C422.241 252.248 416.865 257.88 412.598 259.928C408.502 261.976 403.553 263 397.75 263C396.214 263 395.019 262.403 394.166 261.208C393.142 260.013 392.63 258.307 392.63 256.088V211.544C392.63 209.325 393.142 207.533 394.166 206.168C395.019 204.803 396.214 204.12 397.75 204.12C411.745 204.12 423.435 202.499 432.822 199.256C442.379 196.013 448.779 191.235 452.022 184.92C458.507 172.12 464.225 163.331 469.174 158.552C474.294 153.603 480.438 151.213 487.606 151.384C496.993 151.384 505.014 156.077 511.67 165.464C518.497 174.68 522.678 185.859 524.214 199C525.921 211.971 524.641 223.491 520.374 233.56L507.062 264.792ZM522.35 272.472V269.144L523.63 268.376C530.798 271.619 538.393 274.264 546.414 276.312C554.435 278.36 561.603 279.384 567.918 279.384C577.817 279.384 587.801 277.592 597.87 274.008C607.939 270.424 616.302 265.304 622.958 258.648C629.614 251.992 632.942 244.312 632.942 235.608C632.942 225.539 630.638 216.664 626.03 208.984C621.422 201.133 615.534 195.16 608.366 191.064C601.369 186.797 594.371 184.664 587.374 184.664C583.107 184.664 579.097 185.261 575.342 186.456C571.587 187.48 568.174 189.187 565.102 191.576C562.201 193.795 559.811 196.525 557.934 199.768C569.881 203.181 580.206 204.803 588.91 204.632C597.614 204.461 610.585 202.84 627.822 199.768L634.99 228.696L634.478 249.432L609.902 256.6C602.051 258.989 594.286 259.928 586.606 259.416C578.926 258.904 571.246 257.368 563.566 254.808L551.79 207.448C553.667 197.037 556.313 187.395 559.726 178.52C563.31 169.475 567.747 162.221 573.038 156.76C578.329 151.128 584.217 148.312 590.702 148.312C598.041 148.312 605.294 152.749 612.462 161.624C619.801 170.328 625.774 181.421 630.382 194.904C634.99 208.387 637.294 221.443 637.294 234.072C637.294 249.773 634.393 264.024 628.59 276.824C622.787 289.624 615.193 299.864 605.806 307.544C596.59 315.395 586.947 320.088 576.878 321.624L522.35 272.472ZM653.394 60.4V56.816L670.29 35.568L670.034 47.088C662.866 44.8693 657.234 41.712 653.138 37.616C649.213 33.3493 647.25 28.144 647.25 22C647.25 16.5387 649.042 11.6747 652.626 7.40799C656.21 2.97065 660.733 0.751984 666.194 0.751984C670.802 0.751984 674.727 2.37332 677.97 5.616C681.213 8.68799 683.431 13.7227 684.626 20.72L682.578 23.536C680.871 22.3413 678.738 21.488 676.178 20.976C673.618 20.2933 670.973 19.952 668.242 19.952C662.098 19.952 657.575 21.4027 654.674 24.304C657.575 26.1813 661.33 27.632 665.938 28.656C670.546 29.68 675.325 30.192 680.274 30.192C683.346 30.192 686.247 29.8507 688.978 29.168C691.879 28.3147 695.122 26.6933 698.706 24.304L700.754 26.096L693.33 47.088L656.21 66.8L653.394 60.4ZM667.754 263L661.61 101.464L677.994 75.096L681.834 76.376L687.466 127.32L681.834 132.44L679.274 222.552L670.058 263H667.754Z"
                fill="currentColor"
              />
            </svg>
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

          <div
            className={`transition-all duration-700 delay-200 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
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

          <div
            className={`transition-all duration-700 delay-300 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
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

          <div
            className={`transition-all duration-700 delay-400 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
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

        <div
          className={`border-t border-border pt-5 text-center text-muted-foreground text-xs transition-all duration-700 delay-500 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p>© {new Date().getFullYear()} أوميل. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
