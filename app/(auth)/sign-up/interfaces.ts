interface UserInfo {
  email: string;
  password: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  companyInfo: {
    // Can be optional if the user is not a company
    name?: string;
    // Can be optional if the user is not a company
    phone?: string;
  };
}

interface FormState {
  buttonText: string;
}

export { type UserInfo, type FormState };
