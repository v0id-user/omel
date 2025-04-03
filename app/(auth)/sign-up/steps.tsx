import { useSignUpStore } from './store';
import { FormStep } from './enums';
import { EmailField, PasswordField, NameFields, PhoneField } from './form-inputs';

export const ProcessFormStep = () => {
  const { setFormStep, setFormState, userInfo, formStep } = useSignUpStore();
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
      setFormStep(formStep + 1);
      break;
  }
};

export const RenderFormStep = () => {
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
};
