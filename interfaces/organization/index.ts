export interface OrganizationMetadata {
  createdBy: string;
  createdAt: string;
  type: 'company' | 'individual';
  updatedAt?: string;
  size?: string;
  companyWebsite?: string;
  companyAddress?: string;
}
