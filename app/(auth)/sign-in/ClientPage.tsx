'use client';
import Image from 'next/image';
import { useState } from 'react';
import { AuthFooter } from '@/components/auth';
import { AuthFormInput } from '@/components/auth';
import { Mail, Lock } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { clientValidateEmailInput, clientValidatePasswordInput } from '@/utils/client/validators';
import { toast } from 'react-hot-toast';
import { OButton } from '@/components/omel/Button';
import { useRouter } from 'next/navigation';

enum SignInStep {
  Email,
  Password,
}

export default function SignInClientPage() {
  const [currentStep, setCurrentStep] = useState<SignInStep>(SignInStep.Email);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState('استمر');
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleNextStep = async () => {
    if (currentStep === SignInStep.Email) {
      setIsLoading(true);
      setButtonText('التحقق من البريد الإلكتروني...');

      const emailError = clientValidateEmailInput(email);
      if (emailError) {
        toast.error('البريد الإلكتروني غير صالح');
        setIsLoading(false);
        setButtonText('استمر');
        return;
      }

      setCurrentStep(SignInStep.Password);
      setIsLoading(false);
      setButtonText('تسجيل الدخول');
    } else {
      setIsLoading(true);
      setButtonText('جاري تسجيل الدخول...');

      const passwordError = clientValidatePasswordInput(password);
      if (passwordError) {
        toast.error('كلمة المرور غير صالحة');
        setIsLoading(false);
        setButtonText('تسجيل الدخول');
        return;
      }

      // Here you would normally handle authentication
      // For now we'll just simulate success
      setTimeout(() => {
        setIsLoading(false);
        toast.success('تم تسجيل الدخول بنجاح');
        router.push('/dashboard');
      }, 1000);
    }
  };

  const EmailField = () => (
    <form.Field
      name="email"
      validators={{
        onBlur: ({ value }) => clientValidateEmailInput(value),
      }}
    >
      {field => (
        <>
          <AuthFormInput
            type="email"
            value={email}
            onBlur={field.handleBlur}
            onChange={value => {
              field.handleChange(value);
              setEmail(value);
            }}
            placeholder="ادخل بريد العمل الخاص بك"
            icon={<Mail size={20} />}
          />
          {field.state.meta.errors && (
            <em className="text-red-500 text-sm block mt-1">
              {field.state.meta.errors.join(', ')}
            </em>
          )}
        </>
      )}
    </form.Field>
  );

  const PasswordField = () => (
    <form.Field
      name="password"
      validators={{
        onChange: ({ value }) => clientValidatePasswordInput(value),
      }}
    >
      {field => (
        <>
          <AuthFormInput
            type="password"
            value={password}
            onBlur={field.handleBlur}
            onChange={value => {
              field.handleChange(value);
              setPassword(value);
            }}
            placeholder="ادخل كلمة المرور"
            icon={<Lock size={18} />}
          />
          {field.state.meta.errors && (
            <em className="text-red-500 text-sm block mt-1">
              {field.state.meta.errors.join(', ')}
            </em>
          )}
        </>
      )}
    </form.Field>
  );

  return (
    <div className="flex justify-center items-center flex-col min-h-screen">
      <Image src="/logo_small.png" alt="logo" width={75} height={75} className="mb-16 mt-10" />
      <div className="flex-grow flex flex-col justify-center items-center p-4 md:p-6 lg:p-8">
        <div className="w-full md:w-[450px] max-w-[95vw] md:max-w-[90vw]">
          <h1 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h1>
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

          <div className="border-t border-gray-200 my-6"></div>

          <div className="min-h-[140px]">
            <div className="transition-all duration-300 ease-in-out">
              {currentStep === SignInStep.Email ? (
                <EmailField />
              ) : (
                <div className="space-y-4">
                  <EmailField />
                  <PasswordField />
                </div>
              )}
            </div>
          </div>

          <OButton
            isLoading={isLoading}
            onClick={handleNextStep}
            variant="primary"
            className="w-full"
          >
            {buttonText}
          </OButton>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
