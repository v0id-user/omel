import { PersonalInfo } from '../general/userInfo';
import { CompanyInfo, OrganizationInfo } from './organization';

interface NewCRMUserInfo {
  email: string;
  password: string;
  personalInfo: PersonalInfo;
  companyInfo: CompanyInfo;
}

export { type NewCRMUserInfo, type PersonalInfo, type CompanyInfo, type OrganizationInfo };
