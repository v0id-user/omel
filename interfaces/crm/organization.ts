export interface CompanyInfo {
  name?: string;
  address?: string;
  website?: string;
  size?: '1-9' | '10-99' | '100-499' | '500-999' | '1000-4999' | '5000+';
}

export interface OrganizationInfo {
  companyInfo: CompanyInfo;
  slug: string;
  id: string;
}
