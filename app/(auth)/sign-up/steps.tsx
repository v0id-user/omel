'use client';

import { useSignUpStore } from './store';
import { FormStep } from './enums';
import { EmailField, PasswordField, NameFields, PhoneField, CompanyFields } from './form-inputs';
import { useClientValidations, ValidationType } from '@/hooks/validators';
import { toast } from 'react-hot-toast';
import { clientValidatePasswordInput } from '@/utils/client/validators';
import { trpc } from '@/trpc/client';

function useProcessForm() {
  const { setFormStep, setFormState, userInfo, formStep } = useSignUpStore();
  const createCRMRpc = trpc.crm.new.create.useMutation();
  //TODO: Complete this, validate the eamil first then the rest of the steps.
  const { validator, isLoading } = useClientValidations();

  const processStep = async () => {
    const processes = {
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
        // TODO: Add personal info validation
        // for now only check if the name is not empty
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
        // Validate company info
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

        // Website is optional, but if provided, validate it
        if (
          userInfo.companyInfo.website &&
          !userInfo.companyInfo.website.match(
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
          )
        ) {
          toast.error('الموقع الإلكتروني غير صالح');
          return false;
        }

        return true;
      },
      [FormStep.FinalStep]: async () => {
        // TODO: Create the user and organization
        setFormState({
          buttonText: 'يتم إنشاء تجربتك...',
        });

        const createCRMResponse = await createCRMRpc.mutateAsync(userInfo);
        console.log(createCRMResponse);
        return true;
      },
    };

    // Skip when needed just uncomment this, bad? yeah it need a UI debug, but working for now
    // if (process.env.NEXT_PUBLIC_ENV === 'dev') {
    //   setFormStep(formStep + 1);
    //   return true;
    // }

    const formProcessor = processes[formStep];
    const canProcess = await formProcessor();
    if (!canProcess) return;

    // If there is an error, it must be an early return
    setFormStep(formStep + 1);
  };

  return { processStep, isLoading };
}

function RenderFormStep() {
  const { formStep } = useSignUpStore();
  switch (formStep) {
    case FormStep.AskForEmail:
      return <EmailField />;
    case FormStep.AskForPassword:
      return (
        <div className="space-y-4">
          {/* TODO: We reapet render the feild find a better way to do this */}
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
      return (
        <div className="space-y-4">
          <CompanyFields />
        </div>
      );
  }
}

export { useProcessForm, RenderFormStep };
