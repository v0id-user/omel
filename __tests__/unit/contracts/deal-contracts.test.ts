import { describe, expect, it } from 'bun:test';
import {
  createDealInputSchema,
  dealDeleteInputSchema,
  listDealsInputSchema,
  updateDealInputSchema,
} from '@/features/crm/deals/contracts';

describe('createDealInputSchema', () => {
  it('accepts valid deal input', () => {
    const result = createDealInputSchema.safeParse({
      title: 'صفقة تجريبية',
      amount: '25000',
      ownerId: 'user-1',
    });

    expect(result.success).toBe(true);
  });

  it('accepts optional fields', () => {
    const result = createDealInputSchema.safeParse({
      title: 'صفقة كبرى',
      description: 'صفقة مع عميل مهم',
      amount: '500000',
      currency: 'SAR',
      stage: 'proposal',
      status: 'open',
      probability: 70,
      expectedCloseDate: new Date(),
      contactId: 'contact-1',
      ownerId: 'user-1',
      tags: ['enterprise', 'priority'],
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = createDealInputSchema.safeParse({
      amount: '1000',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid probability values', () => {
    expect(
      createDealInputSchema.safeParse({
        title: 'صفقة',
        amount: '1000',
        ownerId: 'user-1',
        probability: 101,
      }).success
    ).toBe(false);
  });
});

describe('updateDealInputSchema', () => {
  it('accepts partial update input with id', () => {
    const result = updateDealInputSchema.safeParse({
      id: 'deal-1',
      stage: 'won',
    });

    expect(result.success).toBe(true);
  });

  it('rejects update input without id', () => {
    const result = updateDealInputSchema.safeParse({
      stage: 'won',
    });

    expect(result.success).toBe(false);
  });
});

describe('listDealsInputSchema', () => {
  it('applies default limit', () => {
    const result = listDealsInputSchema.safeParse({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(100);
    }
  });

  it('accepts valid filters', () => {
    const result = listDealsInputSchema.safeParse({
      stage: 'qualified',
      status: 'open',
      ownerId: 'user-1',
      search: 'التجديد',
      limit: 20,
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid limit', () => {
    const result = listDealsInputSchema.safeParse({
      limit: 101,
    });

    expect(result.success).toBe(false);
  });
});

describe('dealDeleteInputSchema', () => {
  it('accepts valid id', () => {
    expect(dealDeleteInputSchema.safeParse({ id: 'deal-1' }).success).toBe(true);
  });

  it('rejects empty id', () => {
    expect(dealDeleteInputSchema.safeParse({ id: '' }).success).toBe(false);
  });
});
