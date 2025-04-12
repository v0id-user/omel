import { CompanyInfo, OrganizationInfo } from '@/interfaces/crm';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface UserInfo {
  userId: string;
  email: string;
  personalInfo: PersonalInfo;
  companyInfo: CompanyInfo;
  organizationInfo: OrganizationInfo;
}
