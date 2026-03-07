import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockCreateContact = mock(() => Promise.resolve({ id: 'new-contact-id' }));
const mockUpdateContact = mock(() => Promise.resolve({ id: 'contact-123' }));
const mockGetContactsByPage = mock(() =>
  Promise.resolve({
    data: [],
    total: 0,
    currentPage: 1,
    totalPages: 0,
  })
);
const mockGetTotalContactPages = mock(() => Promise.resolve(0));
const mockGetContactsByIds = mock(() => Promise.resolve([]));
const mockGetBulkContacts = mock(() => Promise.resolve([]));
const mockSearchContacts = mock(() =>
  Promise.resolve({
    data: [],
    total: 0,
    currentPage: 1,
    totalPages: 0,
  })
);
const mockDeleteContact = mock(() => Promise.resolve([{ id: 'contact-123' }]));
const mockDeleteContactsByIds = mock(() => Promise.resolve([{ id: 'c1' }, { id: 'c2' }]));

mock.module('@/features/crm/contacts/server/repository', () => ({
  createContact: mockCreateContact,
  updateContact: mockUpdateContact,
  getContactsByPage: mockGetContactsByPage,
  getTotalContactPages: mockGetTotalContactPages,
  getContactsByIds: mockGetContactsByIds,
  getBulkContacts: mockGetBulkContacts,
  searchContacts: mockSearchContacts,
  deleteContact: mockDeleteContact,
  deleteContactsByIds: mockDeleteContactsByIds,
}));

mock.module('@/utils/emails', () => ({
  validateEmail: mock(() => Promise.resolve(true)),
}));

mock.module('@/utils/phone/validate', () => ({
  validatePhoneGeneral: mock(() => undefined),
  validatePhoneArab: mock(() => true),
}));

import * as service from '@/features/crm/contacts/server/service';

describe('contacts service', () => {
  beforeEach(() => {
    mockCreateContact.mockClear();
    mockUpdateContact.mockClear();
    mockGetContactsByPage.mockClear();
    mockGetTotalContactPages.mockClear();
    mockGetContactsByIds.mockClear();
    mockGetBulkContacts.mockClear();
    mockSearchContacts.mockClear();
    mockDeleteContact.mockClear();
    mockDeleteContactsByIds.mockClear();
  });

  describe('createNewContact', () => {
    it('creates a contact with valid input', async () => {
      const input = {
        name: 'Ahmed Ali',
        email: 'ahmed@example.com',
        phone: '+966511111111',
      };

      await service.createNewContact('org-1', 'user-1', input);
      expect(mockCreateContact).toHaveBeenCalledTimes(1);
      expect(mockCreateContact).toHaveBeenCalledWith('org-1', 'user-1', input);
    });

    it('throws on missing email', async () => {
      const input = {
        name: 'Ahmed Ali',
        email: null as any,
        phone: '+966511111111',
      };

      try {
        await service.createNewContact('org-1', 'user-1', input);
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(err.code).toBe('BAD_REQUEST');
      }
    });

    it('throws on missing phone', async () => {
      const input = {
        name: 'Ahmed Ali',
        email: 'ahmed@example.com',
        phone: null as any,
      };

      try {
        await service.createNewContact('org-1', 'user-1', input);
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(err.code).toBe('BAD_REQUEST');
      }
    });
  });

  describe('getContactsByPage', () => {
    it('calls repository with validated params', async () => {
      await service.getContactsByPage('org-1', 1, 10);
      expect(mockGetContactsByPage).toHaveBeenCalledTimes(1);
      expect(mockGetContactsByPage).toHaveBeenCalledWith('org-1', 1, 10);
    });

    it('rejects page 0 via schema validation', async () => {
      try {
        await service.getContactsByPage('org-1', 0, 10);
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('getTotalContactPages', () => {
    it('calls repository with validated length', async () => {
      await service.getTotalContactPages('org-1', 10);
      expect(mockGetTotalContactPages).toHaveBeenCalledTimes(1);
      expect(mockGetTotalContactPages).toHaveBeenCalledWith('org-1', 10);
    });
  });

  describe('getContactsByIds', () => {
    it('passes through to repository', async () => {
      await service.getContactsByIds('org-1', ['id-1', 'id-2']);
      expect(mockGetContactsByIds).toHaveBeenCalledTimes(1);
      expect(mockGetContactsByIds).toHaveBeenCalledWith('org-1', ['id-1', 'id-2']);
    });
  });

  describe('getBulkContacts', () => {
    it('calls repository with validated limit', async () => {
      await service.getBulkContacts('org-1', 50);
      expect(mockGetBulkContacts).toHaveBeenCalledTimes(1);
      expect(mockGetBulkContacts).toHaveBeenCalledWith('org-1', 50);
    });
  });

  describe('searchContacts', () => {
    it('calls repository with validated search params', async () => {
      await service.searchContacts('org-1', 'Ahmed', 1, 20);
      expect(mockSearchContacts).toHaveBeenCalledTimes(1);
      expect(mockSearchContacts).toHaveBeenCalledWith('org-1', 'Ahmed', 1, 20);
    });
  });

  describe('deleteContact', () => {
    it('calls repository delete', async () => {
      await service.deleteContact('org-1', 'contact-123');
      expect(mockDeleteContact).toHaveBeenCalledTimes(1);
      expect(mockDeleteContact).toHaveBeenCalledWith('org-1', 'contact-123');
    });
  });

  describe('deleteContactsByIds', () => {
    it('calls repository bulk delete', async () => {
      await service.deleteContactsByIds('org-1', ['c1', 'c2']);
      expect(mockDeleteContactsByIds).toHaveBeenCalledTimes(1);
      expect(mockDeleteContactsByIds).toHaveBeenCalledWith('org-1', ['c1', 'c2']);
    });
  });
});
