export const validContactInput = {
  name: 'Ahmed Ali',
  email: 'ahmed@example.com',
  phone: '+966511111111',
  address: '123 Test St',
  city: 'Riyadh',
  region: 'Riyadh Region',
  country: 'SA',
  postalCode: '12345',
  contactType: 'person' as const,
  domain: 'example.com',
  additionalPhones: null,
  taxId: null,
  businessType: null,
  employees: null,
};

export const invalidContactInput = {
  name: '',
  email: 'not-an-email',
  phone: '',
};

export const validCRMSignupInput = {
  email: 'test@gmail.com',
  password: 'password123',
  personalInfo: {
    firstName: 'Test',
    lastName: 'User',
    phone: '+966511111111',
  },
  companyInfo: {
    name: 'Test Company',
    website: 'https://test.com',
    address: '123 Test St',
    size: '1-9' as const,
  },
};

export const validTaskInput = {
  description: 'Test task description',
  assignedTo: 'test-user-id',
  status: 'pending' as const,
  priority: 'low' as const,
};

export const testUser = {
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  emailVerified: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  twoFactorEnabled: false,
};

export const testOrganization = {
  id: 'test-org-id',
  name: 'Test Organization',
  slug: 'test-org',
  createdAt: new Date('2025-01-01'),
};
