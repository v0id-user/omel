'use client';

import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { RenderFormStep, useProcessForm } from './steps';
import { useSignUpStore } from './store';
import { FormStep } from './enums';
import { ArrowRight } from 'lucide-react';
import { OButton } from '@/components/omel/Button';

export default function SignUpForm() {
  const { setFormStep, formStep, formState } = useSignUpStore();
  const { processStep, isLoading } = useProcessForm();
  return (
    <div className="w-full md:w-[450px]">
      {/** Go Back Button to change form data if needed */}
      {formStep !== FormStep.AskForEmail && (
        <ArrowRight
          className="w-7 h-7 mb-8 text-gray-400 hover:text-gray-500 cursor-pointer 
                     transition-all rounded-full hover:bg-gray-200/50 p-1
                     ease-in-out duration-400"
          onClick={() => {
            setFormStep(formStep - 1);
          }}
        />
      )}
      {/* Google Login Button */}
      <div className="mb-8">
        <button className="w-full flex items-center justify-center gap-2 p-3 border cursor-pointer border-gray-700 rounded-md hover:bg-gray-200/50 transition-colors">
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

      <div className="min-h-[140px]">
        <div
          className={`transition-all duration-300 ease-in-out ${formStep === FormStep.AskForPassword ? 'opacity-100' : 'opacity-100'}`}
        >
          {RenderFormStep()}
        </div>
      </div>

      {/* Process Form Button                                            */}
      <OButton isLoading={isLoading} onClick={processStep} variant="primary" className="w-full">
        {formState.buttonText}
      </OButton>

      {formStep === FormStep.AskForEmail && (
        <p className="text-xs text-gray-400 mt-8 text-right">
          بإدخال بريدك الإلكتروني، فإنك توافق على تواصل أوميل معك بخصوص منتجاتنا وخدماتنا. يمكنك
          إلغاء الاشتراك في أي وقت بالنقر على إلغاء الاشتراك في رسائلنا الإلكترونية. اعرف المزيد حول
          كيفية استخدامنا للبيانات في{' '}
          <Link href="/privacy-policy" className="underline">
            سياسة الخصوصية
          </Link>
          .
        </p>
      )}
    </div>
  );
}
