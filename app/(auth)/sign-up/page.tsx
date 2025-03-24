import Image from 'next/image';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
// Onboarding sign up page for new users

export const metadata: Metadata = {
  title: 'أوميل - تسجيل الدخول',
  description: 'تسجيل الدخول إلى أوميل للبدء في إدارة علاقات العملاء الخاصة بك.',
};

const SignUpContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="border border-solid border-gray-700 rounded-xl py-12 md:py-20 lg:py-32 
                    px-6 md:px-8 lg:px-12 w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[1200px]"
    >
      {children}
    </div>
  );
};

const SignUpForm = () => {
  return (
    <div className="w-full md:w-[450px]">
      <div className="mb-8">
        <button className="w-full flex items-center justify-center gap-2 p-3 border border-gray-700 rounded-md hover:bg-gray-700/50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          <span className="text-black">تسجيل الدخول باستخدام جوجل</span>
        </button>
      </div>
      <Separator className="my-6" />
      <div className="relative mb-8">
        <input
          type="email"
          placeholder="ادخل بريد العمل الخاص بك"
          className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Mail
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
      </div>

      <button className="w-full bg-black text-white cursor-pointer py-3 px-4 rounded-md hover:bg-gray-800 transition-colors">
        استمر
      </button>

      <p className="text-xs text-gray-400 mt-8 text-right">
        بإدخال بريدك الإلكتروني، فإنك توافق على تواصل أوميل معك بخصوص منتجاتنا وخدماتنا. يمكنك إلغاء
        الاشتراك في أي وقت بالنقر على إلغاء الاشتراك في رسائلنا الإلكترونية. اعرف المزيد حول كيفية
        استخدامنا للبيانات في{' '}
        <Link href="/privacy-policy" className="underline">
          سياسة الخصوصية
        </Link>
        .
      </p>
    </div>
  );
};

const SignUpDisplayText = () => {
  return (
    <div className="w-full md:w-[450px] text-right mt-8 md:mt-0">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black">مرحباً بك في أوميل.</h1>
      <p className="text-black">
        أوميل هو نوع جديد تماماً من برامج إدارة علاقات العملاء. مبني على هندسة بيانات مختلفة كلياً،
        ستحصل على ملفات وسجلات لكل تفاعل داخل شبكتك في دقائق، محدثة دائماً في الوقت الفعلي.
      </p>
      <p className="text-black mt-6">
        ستتمكن من تخصيص وإنشاء نظام إدارة علاقات العملاء الخاص بك تماماً كما تريد.
      </p>
      <p className="text-black mt-6">هيا نبدأ.</p>
    </div>
  );
};

const SignUpFooter = () => {
  return (
    <footer className="p-4">
      <div className="container flex flex-col sm:flex-row mx-auto gap-2 justify-center items-center text-sm text-gray-400">
        <div>© 2025 أوميل</div>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-gray-300 underline">
            سياسة الخصوصية
          </Link>
          <Link href="/support" className="hover:text-gray-300 underline">
            الدعم
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default function SignUp() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col justify-center items-center p-4 md:p-6 lg:p-8">
        <Image src="/logo_small.png" alt="logo" width={75} height={75} className="mb-6" />
        <SignUpContainer>
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-28 justify-center items-center">
            <SignUpForm />
            <SignUpDisplayText />
          </div>
        </SignUpContainer>
      </div>

      <SignUpFooter />
    </div>
  );
}
