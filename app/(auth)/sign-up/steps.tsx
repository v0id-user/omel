'use client';

import { useSignUpStore } from './store';
import { FormStep } from './enums';
import { EmailField, PasswordField, NameFields, PhoneField } from './form-inputs';
import { useClientValidations } from '@/hooks/validators';

function useProcessForm() {
  const { setFormStep, setFormState, userInfo, formStep } = useSignUpStore();
  const { isLoading } = useClientValidations();
  const processStep = () => {
    switch (formStep) {
      case FormStep.AskForEmail:
        setFormState({
          buttonText: 'التحقق من البريد الإلكتروني...',
          errorText: null,
        });
        // TODO: Validate email
        console.log(userInfo);
        break;
      case FormStep.AskForPassword:
        //TODO: Validate password
        console.log(userInfo);
        break;
      case FormStep.AskForPersonalInfo:
        //TODO: Validate personal info
        console.log(userInfo);
        break;
    }

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
  }
}

export { useProcessForm, RenderFormStep };
