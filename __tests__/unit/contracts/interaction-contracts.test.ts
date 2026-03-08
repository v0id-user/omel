import { describe, expect, it } from 'bun:test';
import {
  createInteractionInputSchema,
  interactionDeleteInputSchema,
  listInteractionsInputSchema,
  updateInteractionInputSchema,
} from '@/features/crm/interactions/contracts';

describe('createInteractionInputSchema', () => {
  it('accepts valid interaction input', () => {
    const result = createInteractionInputSchema.safeParse({
      type: 'note',
      subject: 'ملاحظة متابعة',
      content: 'تمت مكالمة تعريفية مع العميل',
      contactId: 'contact-1',
    });

    expect(result.success).toBe(true);
  });

  it('accepts linked deal and metadata fields', () => {
    const result = createInteractionInputSchema.safeParse({
      type: 'meeting',
      subject: 'اجتماع عرض',
      content: 'عرض مبدئي للمنصة',
      occurredAt: new Date(),
      contactId: 'contact-1',
      dealId: 'deal-1',
      taskId: 'task-1',
      metadata: {
        location: 'الرياض',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid interaction type', () => {
    const result = createInteractionInputSchema.safeParse({
      type: 'chat',
    });

    expect(result.success).toBe(false);
  });
});

describe('updateInteractionInputSchema', () => {
  it('accepts partial update input with id', () => {
    const result = updateInteractionInputSchema.safeParse({
      id: 'interaction-1',
      content: 'تم تحديث الملاحظة',
    });

    expect(result.success).toBe(true);
  });

  it('rejects update input without id', () => {
    const result = updateInteractionInputSchema.safeParse({
      content: 'بدون معرف',
    });

    expect(result.success).toBe(false);
  });
});

describe('listInteractionsInputSchema', () => {
  it('applies default limit', () => {
    const result = listInteractionsInputSchema.safeParse({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(100);
    }
  });

  it('accepts valid filters', () => {
    const result = listInteractionsInputSchema.safeParse({
      type: 'email',
      contactId: 'contact-1',
      dealId: 'deal-1',
      search: 'عرض',
      limit: 10,
    });

    expect(result.success).toBe(true);
  });
});

describe('interactionDeleteInputSchema', () => {
  it('accepts valid id', () => {
    expect(interactionDeleteInputSchema.safeParse({ id: 'interaction-1' }).success).toBe(true);
  });

  it('rejects empty id', () => {
    expect(interactionDeleteInputSchema.safeParse({ id: '' }).success).toBe(false);
  });
});
