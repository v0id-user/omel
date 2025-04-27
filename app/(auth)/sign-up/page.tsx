import Image from 'next/image';
import { Metadata } from 'next';
import SignUpForm from './SignUpForm';
import { AuthFooter } from '@/components/auth';
export const metadata: Metadata = {
  title: 'أوميل - تسجيل الدخول',
  description: 'تسجيل الدخول إلى أوميل للبدء في إدارة علاقات العملاء الخاصة بك.',
};

const SignUpContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="ring-1 ring-black/60 rounded-xl py-20
                    px-6 md:px-8 lg:px-12 w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[1200px]"
    >
      {children}
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

export default function SignUp() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col items-center justify-center p-2">
        <Image src="/logo_small.png" alt="logo" width={75} height={75} className="mb-16" priority />
        <SignUpContainer>
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-28 justify-center items-center">
            <SignUpForm />
            <SignUpDisplayText />
          </div>
        </SignUpContainer>
      </div>

      <AuthFooter />
    </div>
  );
}
