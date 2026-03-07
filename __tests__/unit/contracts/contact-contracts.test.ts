import { describe, it, expect } from 'bun:test';
import {
  createContactInputSchema,
  updateContactInputSchema,
  contactPageInputSchema,
  contactPagesInputSchema,
  bulkContactsInputSchema,
  searchContactsInputSchema,
  contactDeleteInputSchema,
  contactIdsInputSchema,
} from '@/features/crm/contacts/contracts';

describe('createContactInputSchema', () => {
  it('accepts valid contact input', () => {
    const result = createContactInputSchema.safeParse({
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      phone: '+966511111111',
    });
    expect(result.success).toBe(true);
  });

  it('accepts all optional fields', () => {
    const result = createContactInputSchema.safeParse({
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      phone: '+966511111111',
      address: '123 Test St',
      city: 'Riyadh',
      region: 'Riyadh Region',
      country: 'SA',
      postalCode: '12345',
      contactType: 'company',
      domain: 'example.com',
      additionalPhones: ['+966522222222'],
      taxId: 'TAX123',
      businessType: 'Technology',
      employees: '50',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = createContactInputSchema.safeParse({
      name: '',
      email: 'ahmed@example.com',
      phone: '+966511111111',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const result = createContactInputSchema.safeParse({
      email: 'ahmed@example.com',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid contact type', () => {
    const result = createContactInputSchema.safeParse({
      name: 'Ahmed',
      email: 'ahmed@example.com',
      phone: '+966511111111',
      contactType: 'invalid',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateContactInputSchema', () => {
  it('accepts valid update input with id', () => {
    const result = updateContactInputSchema.safeParse({
      id: 'contact-123',
      name: 'Updated Name',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing id', () => {
    const result = updateContactInputSchema.safeParse({
      name: 'Updated Name',
    });
    expect(result.success).toBe(false);
  });

  it('allows nullable optional fields', () => {
    const result = updateContactInputSchema.safeParse({
      id: 'contact-123',
      name: 'Updated Name',
      email: null,
      phone: null,
    });
    expect(result.success).toBe(true);
  });
});

describe('contactPageInputSchema', () => {
  it('accepts valid page input', () => {
    const result = contactPageInputSchema.safeParse({ page: 1, limit: 10 });
    expect(result.success).toBe(true);
  });

  it('applies defaults when fields are omitted', () => {
    const result = contactPageInputSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    }
  });

  it('rejects page less than 1', () => {
    const result = contactPageInputSchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects limit greater than 50', () => {
    const result = contactPageInputSchema.safeParse({ page: 1, limit: 51 });
    expect(result.success).toBe(false);
  });
});

describe('contactPagesInputSchema', () => {
  it('accepts valid length', () => {
    const result = contactPagesInputSchema.safeParse({ length: 25 });
    expect(result.success).toBe(true);
  });

  it('defaults to 10', () => {
    const result = contactPagesInputSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.length).toBe(10);
    }
  });

  it('rejects length over 100', () => {
    const result = contactPagesInputSchema.safeParse({ length: 101 });
    expect(result.success).toBe(false);
  });
});

describe('bulkContactsInputSchema', () => {
  it('accepts valid limit', () => {
    const result = bulkContactsInputSchema.safeParse({ limit: 50 });
    expect(result.success).toBe(true);
  });

  it('rejects limit below 10', () => {
    const result = bulkContactsInputSchema.safeParse({ limit: 5 });
    expect(result.success).toBe(false);
  });

  it('rejects limit above 100', () => {
    const result = bulkContactsInputSchema.safeParse({ limit: 101 });
    expect(result.success).toBe(false);
  });
});

describe('searchContactsInputSchema', () => {
  it('accepts valid search input', () => {
    const result = searchContactsInputSchema.safeParse({
      searchTerm: 'Ahmed',
      page: 1,
      limit: 20,
    });
    expect(result.success).toBe(true);
  });

  it('trims search term', () => {
    const result = searchContactsInputSchema.safeParse({
      searchTerm: '  Ahmed  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.searchTerm).toBe('Ahmed');
    }
  });

  it('rejects empty search term', () => {
    const result = searchContactsInputSchema.safeParse({ searchTerm: '' });
    expect(result.success).toBe(false);
  });

  it('applies defaults for page and limit', () => {
    const result = searchContactsInputSchema.safeParse({ searchTerm: 'test' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });
});

describe('contactDeleteInputSchema', () => {
  it('accepts valid id', () => {
    const result = contactDeleteInputSchema.safeParse({ id: 'contact-123' });
    expect(result.success).toBe(true);
  });

  it('rejects empty id', () => {
    const result = contactDeleteInputSchema.safeParse({ id: '' });
    expect(result.success).toBe(false);
  });
});

describe('contactIdsInputSchema', () => {
  it('accepts valid array of ids', () => {
    const result = contactIdsInputSchema.safeParse({ ids: ['a', 'b', 'c'] });
    expect(result.success).toBe(true);
  });

  it('rejects empty array', () => {
    const result = contactIdsInputSchema.safeParse({ ids: [] });
    expect(result.success).toBe(false);
  });

  it('rejects more than 50 ids', () => {
    const ids = Array.from({ length: 51 }, (_, i) => `id-${i}`);
    const result = contactIdsInputSchema.safeParse({ ids });
    expect(result.success).toBe(false);
  });
});
