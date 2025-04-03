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
  errorText: string | null;
}

export { type UserInfo, type FormState };
