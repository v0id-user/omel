interface NewCRMUserInfo {
  email: string;
  password: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  companyInfo: {
    // This can be optional if the user is not a company
    name?: string;
    address?: string;
    website?: string;
    size?: '1-9' | '10-99' | '100-499' | '500-999' | '1000-4999' | '5000+';
  };
}

export { type NewCRMUserInfo };
