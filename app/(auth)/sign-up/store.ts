import { create } from 'zustand';
import { FormStep } from './enums';
import { FormState } from './interfaces';
import { UserInfo } from './interfaces';
interface SignUpStore {
  formStep: FormStep;
  setFormStep: (formStep: FormStep) => void;
  formState: FormState;
  setFormState: (formState: FormState) => void;
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
}

export const useSignUpStore = create<SignUpStore>(set => ({
  formStep: FormStep.AskForEmail,
  setFormStep: (formStep: FormStep) => set({ formStep }),
  formState: {
    buttonText: 'استمر',
    isProcessing: false,
    errorText: null,
  },
  setFormState: (formState: FormState) => set({ formState }),
  userInfo: {
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
  },
  setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
}));
