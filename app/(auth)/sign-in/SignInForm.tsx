'use client';

import Image from 'next/image';
import { AuthFooter, EmailField, PasswordField } from '@/components/auth';
import { clientValidatePasswordInput } from '@/utils/client/validators';
import { toast } from 'react-hot-toast';
import { OButton } from '@/components/omel/Button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth/userInfo';
import { FormStep } from '@/enums/auth';
import { useClientValidations, ValidationType } from '@/hooks/validators';

export default function SignInClientPage() {
  const { userInfo, formState, formStep, setFormState, setFormStep } = useAuthStore();
  const { validator, isLoading, setIsLoading } = useClientValidations();
  const router = useRouter();

  const handleNextStep = async () => {
    // if (process.env.NEXT_PUBLIC_ENV === 'dev') {
    //   console.log('userInfo', userInfo);
    //   setFormState({
    //     buttonText: 'استمر',
    //   });
    //   setFormStep(FormStep.AskForPassword);
    //   return;
    // }

    if (formStep === FormStep.AskForEmail) {
      setFormState({
        buttonText: 'التحقق من البريد الإلكتروني...',
      });

      const isValid = await validator(ValidationType.Email, userInfo.email);
      if (!isValid) {
        toast.error('البريد الإلكتروني غير صالح');
        setFormState({
          buttonText: 'استمر',
        });
        setIsLoading(false);
        return;
      }

      setFormStep(FormStep.AskForPassword);
      setFormState({
        buttonText: 'تسجيل الدخول',
      });
      setIsLoading(false);
    } else {
      setFormState({
        buttonText: 'جاري تسجيل الدخول...',
      });

      const passwordError = clientValidatePasswordInput(userInfo.password);
      if (passwordError) {
        toast.error('كلمة المرور غير صالحة');
        setFormState({
          buttonText: 'تسجيل الدخول',
        });
        setIsLoading(false);
        return;
      }

      // TODO:
      // Perform login logic with TRPC plz...?

      // TODO: Remove
      return;
      setTimeout(() => {
        toast.success('تم تسجيل الدخول بنجاح');
        router.push('/dashboard');
      }, 1000);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen">
      <Image
        src="/logo_small.png"
        alt="logo"
        width={65}
        height={65}
        className="mb-16 mt-10"
        priority
      />
      <div className="flex-grow flex flex-col justify-center items-center pb-24">
        <div className="w-full md:w-[400px] max-w-[95vw] md:max-w-[90vw]">
          <h1 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h1>
          {/* Google Login Button */}
          <div className="mb-8">
            <button className="w-full flex items-center justify-center gap-2 p-2 border cursor-pointer border-gray-700 rounded-md hover:bg-gray-200/50 transition-colors">
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

          <div
            className={`${formStep === FormStep.AskForPassword ? 'min-h-[140px]' : 'min-h-[80px]'}`}
          >
            {formStep === FormStep.AskForEmail ? (
              <EmailField />
            ) : (
              <div className="space-y-4">
                <EmailField />
                <PasswordField />
              </div>
            )}
          </div>

          <OButton
            onClick={handleNextStep}
            isLoading={isLoading}
            variant="primary"
            className="w-full"
          >
            {formState.buttonText}
          </OButton>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
