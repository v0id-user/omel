'use client';

import { useSignUpStore } from './store';
import { FormStep } from './enums';
import { EmailField, PasswordField, NameFields, PhoneField } from './form-inputs';

function useProcessForm() {
  const { setFormStep, setFormState, userInfo, formStep } = useSignUpStore();

  const processStep = () => {
    switch (formStep) {
      case FormStep.AskForEmail:
        setFormState({
          buttonText: 'التحقق من البريد الإلكتروني...',
          isProcessing: true,
          errorText: null,
        });
        // TODO: Validate email
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
        setFormStep(formStep + 1);
        break;
    }
  };

  return processStep;
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
