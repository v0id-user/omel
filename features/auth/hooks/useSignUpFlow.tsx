'use client';

import { useAuthStore } from '@/store/auth/userInfo';
import { FormStep } from '@/enums/auth/enums';
import {
  EmailField,
  PasswordField,
  NameFields,
  PhoneField,
  CompanyFields,
} from '@/features/auth/ui/AuthFields';
import { useClientValidations, ValidationType } from '@/hooks/validators';
import { toast } from 'react-hot-toast';
import { clientValidatePasswordInput } from '@/utils/client/validators';
import { trpc } from '@/trpc/client';
import { TRPCClientError } from '@trpc/client';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/betterauth/auth-client';
import { z } from 'zod';

function useProcessForm() {
  const router = useRouter();
  const { setFormStep, setFormState, userInfo, formStep } = useAuthStore();
  const createCRMRpc = trpc.crm.new.create.useMutation();
  const { validator, isLoading, setIsLoading } = useClientValidations();

  const processStep = async () => {
    const processes: Record<FormStep, () => Promise<boolean>> = {
      [FormStep.AskForEmail]: async () => {
        setFormState({
          buttonText: 'التحقق من البريد الإلكتروني...',
        });

        console.log(userInfo);

        const isValid = await validator(ValidationType.Email, userInfo.email);
        console.log(isValid);

        if (!isValid) {
          setFormState({
            buttonText: 'استمر',
          });
          toast.error('البريد الإلكتروني غير صالح');
          return false;
        }
        setFormState({
          buttonText: 'استمر',
        });
        return true;
      },

      [FormStep.AskForPassword]: async () => {
        const isValidPassword = clientValidatePasswordInput(userInfo.password);
        if (isValidPassword !== undefined) {
          toast.error('كلمة المرور غير صالحة');
          return false;
        }
        return true;
      },

      [FormStep.AskForPersonalInfo]: async () => {
        console.log(userInfo.personalInfo);
        setFormState({
          buttonText: 'التحقق من رقم الهاتف...',
        });
        if (!userInfo.personalInfo.firstName || !userInfo.personalInfo.lastName) {
          setFormState({
            buttonText: 'استمر',
          });
          toast.error('الاسم غير صالح');
          return false;
        }

        if (!userInfo.personalInfo.phone) {
          setFormState({
            buttonText: 'استمر',
          });
          toast.error('رقم الهاتف غير صالح');
          return false;
        }
        console.log('Phone number', userInfo.personalInfo.phone);
        const isValidPhone = await validator(ValidationType.Phone, userInfo.personalInfo.phone);
        if (!isValidPhone) {
          console.log(isValidPhone, 'validator says not valid');
          setFormState({
            buttonText: 'استمر',
          });
          toast.error('رقم الهاتف غير صالح');
          return false;
        }
        setFormState({
          buttonText: 'استمر',
        });
        return true;
      },

      [FormStep.AskForCompanyInfo]: async () => {
        console.log(userInfo);
        if (!userInfo.companyInfo.name) {
          toast.error('اسم الشركة مطلوب');
          return false;
        }

        if (!userInfo.companyInfo.address) {
          toast.error('عنوان الشركة مطلوب');
          return false;
        }

        if (!userInfo.companyInfo.size) {
          toast.error('حجم الشركة مطلوب');
          return false;
        }

        if (userInfo.companyInfo.website) {
          const websiteSchema = z.string().url().optional();
          const result = websiteSchema.safeParse(userInfo.companyInfo.website);
          if (!result.success) {
            toast.error('الموقع الإلكتروني غير صالح');
            return false;
          }
        }

        return true;
      },

      [FormStep.FinalStep]: async () => {
        try {
          setIsLoading(true);
          setFormState({
            buttonText: 'يتم إنشاء تجربتك...',
          });
          const createCRMResponse = await createCRMRpc.mutateAsync(userInfo);
          console.log('CRM created successfully:', createCRMResponse);

          const data = await authClient.organization.setActive({
            organizationId: createCRMResponse.organizationId,
          });

          if (data.error) {
            toast.error('حدث خطأ أثناء إنشاء الحساب');
            setIsLoading(false);
            return false;
          }

          toast.success('تم إنشاء حسابك بنجاح');

          router.push('/dashboard');

          return false;
        } catch (error: unknown) {
          console.error('Error creating CRM:', error);
          setIsLoading(false);
          setFormState({
            buttonText: 'استمر',
          });

          if (error instanceof TRPCClientError) {
            const errorData = error.data as { code?: string } | undefined;

            if (errorData?.code) {
              switch (errorData.code) {
                case 'CONFLICT':
                  toast.error('البريد الإلكتروني أو اسم المنظمة مستخدم بالفعل');
                  break;
                case 'BAD_REQUEST':
                  toast.error('بيانات غير صالحة، يرجى التحقق من المعلومات المدخلة');
                  break;
                default:
                  toast.error('حدث خطأ أثناء إنشاء الحساب');
              }
            } else {
              toast.error('حدث خطأ أثناء إنشاء الحساب');
            }
          } else if (error instanceof Error) {
            toast.error('حدث خطأ أثناء إنشاء الحساب');
          } else {
            toast.error('حدث خطأ أثناء إنشاء الحساب');
          }

          return false;
        }
      },
    };

    if (
      process.env.NEXT_PUBLIC_ENV === 'dev' &&
      process.env.NEXT_PUBLIC_SIGNUP_DEV_BYPASS === 'true'
    ) {
      setFormStep(formStep + 1);
      return true;
    }
    const formProcessor = processes[formStep];
    const canProcess = await formProcessor();
    if (!canProcess) return;

    setFormStep(formStep + 1);
    console.log('Form step', formStep);
  };

  return { processStep, isLoading };
}

function RenderFormStep() {
  const { formStep } = useAuthStore();
  switch (formStep) {
    case FormStep.AskForEmail:
      return <EmailField />;
    case FormStep.AskForPassword:
      return (
        <div className="space-y-4">
          <EmailField />
          <PasswordField />
        </div>
      );
    case FormStep.AskForPersonalInfo:
      return (
        <div className="space-y-4">
          <NameFields />
          <PhoneField />
        </div>
      );
    case FormStep.AskForCompanyInfo:
    case FormStep.FinalStep:
    default:
      return (
        <div className="space-y-4">
          <CompanyFields />
        </div>
      );
  }
}

export { useProcessForm, RenderFormStep };
