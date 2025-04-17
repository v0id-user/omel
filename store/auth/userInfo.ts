import { create } from 'zustand';
import { FormStep } from '@/enums/auth';
import { FormState } from '@/interfaces/auth';
import { NewCRMUserInfo as UserInfo } from '@/interfaces/crm';

interface AuthStore {
  formStep: FormStep;
  setFormStep: (formStep: FormStep) => void;
  formState: FormState;
  setFormState: (formState: FormState) => void;
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
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
