'use client';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, Phone } from 'lucide-react';
import Link from 'next/link';
import { formOptions, useForm } from '@tanstack/react-form';

enum FormStep {
  AskForEmail = 0,
  AskForPassword = 1,
  AskForPersonalInfo = 2,
  AskForCompanyInfo = 3,
}

interface UserInfo {
  email: string;
  password: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  companyInfo: {
    name: string;
    phone: string;
  };
}

interface FormState {
  buttonText: string;
  isProcessing: boolean;
  errorText: string | null;
}

export default function SignUpForm() {
  const userInfo = formOptions({
    defaultValues: {
      email: '',
      password: '',
      personalInfo: {
        firstName: '',
        lastName: '',
        phone: '',
      },
      companyInfo: {
        name: '',
        phone: '',
      },
    } as UserInfo,
  });

  const [formStep, setFormStep] = useState(FormStep.AskForEmail);
  const [formState, setFormState] = useState<FormState>({
    buttonText: 'استمر',
    isProcessing: false,
    errorText: null,
  });

  const form = useForm({
    ...userInfo,
  });

  const ProcessFormStep = async () => {
    switch (formStep) {
      case FormStep.AskForEmail:
        // TODO: Not like that
        // if (!userInfo.defaultValues.email) {
        //   setFormState({
        //     buttonText: 'استمر',
        //     isProcessing: false,
        //     errorText: 'يجب إدخال بريد العمل الخاص بك',
        //   });
        //   return;
        // }

        setFormState({
          buttonText: 'التحقق من البريد الإلكتروني...',
          isProcessing: true,
          errorText: null,
        });
        // console.log(userInfo);

        // TODO: Validate email

        // Using TRPC to validate email

        // Increment form step after processing
        console.log(userInfo);
        setFormStep(formStep + 1);
        break;
      case FormStep.AskForPassword:
        //TODO: Validate password
        console.log(userInfo);
        setFormStep(formStep + 1);
        break;
      case FormStep.AskForPersonalInfo:
        //TODO: Validate personal info
        console.log(userInfo);
        break;
    }
  };

  const RenderFormStep = () => {
    switch (formStep) {
      case FormStep.AskForEmail:
        return (
          <div className="relative">
            <form.Field name="email">
              {field => (
                <>
                  <input
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder="ادخل بريد العمل الخاص بك"
                    className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </>
              )}
            </form.Field>
          </div>
        );
      case FormStep.AskForPassword:
        return (
          <div className="space-y-4">
            <div className="relative">
              {/* TODO: We reapet render the feild find a better way to do this */}
              <form.Field name="email">
                {field => (
                  <>
                    <input
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="ادخل بريد العمل الخاص بك"
                      className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </>
                )}
              </form.Field>
            </div>
            <div className="relative">
              <form.Field name="password">
                {field => (
                  <>
                    <input
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="ادخل كلمة المرور"
                      className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </>
                )}
              </form.Field>
            </div>
          </div>
        );
      case FormStep.AskForPersonalInfo:
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <form.Field name="personalInfo.firstName">
                {field => (
                  <>
                    <input
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="اسمك الأول"
                      className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                )}
              </form.Field>
              <form.Field name="personalInfo.lastName">
                {field => (
                  <>
                    <input
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="اسمك الأخير"
                      className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                )}
              </form.Field>
            </div>
            <div className="relative">
              <form.Field name="personalInfo.phone">
                {field => (
                  <>
                    <input
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="رقم الهاتف"
                      className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </>
                )}
              </form.Field>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full md:w-[450px]">
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

      {/* Process Form Button */}
      <button
        className="w-full bg-black text-white cursor-pointer py-3 px-4 
      rounded-md hover:bg-gray-800 transition-colors"
        disabled={formState.isProcessing}
        onClick={() => {
          ProcessFormStep();
        }}
      >
        {formState.buttonText}
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
}
