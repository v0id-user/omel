'use client';

import { DashboardDialog } from '@/components/dashboard/Dialog';
import { OButton } from '@/components/omel/Button';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { trpc } from '@/trpc/client';
import { EditContactForm } from './forms/EditContactForm';
import { Contact } from '@/database/types/contacts';

interface EditContactsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contactIds: string[];
}

export function EditContactsDialog({ isOpen, onClose, contactIds }: EditContactsDialogProps) {
  const [currentContactIndex, setCurrentContactIndex] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const utils = trpc.useUtils();

  // Fetch contacts data when dialog opens
  const { data: contactsData, isPending } = trpc.crm.dashboard.contact.getByIds.useQuery(
    { ids: contactIds },
    {
      enabled: isOpen && contactIds.length > 0,
      retry: false,
    }
  );

  // Update mutation
  const { mutate: updateContact, isPending: isUpdating } =
    trpc.crm.dashboard.contact.update.useMutation({
      onSuccess: () => {
        toast.success('تم تحديث العميل بنجاح');
        utils.crm.dashboard.contact.invalidate();
      },
      onError: error => {
        console.error('Error updating contact:', error);
        toast.error('حدث خطأ أثناء تحديث العميل');
      },
    });

  // Initialize contacts data
  useEffect(() => {
    if (contactsData) {
      setContacts(contactsData);
    }
  }, [contactsData]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentContactIndex(0);
      setContacts([]);
    }
  }, [isOpen]);

  const currentContact = contacts[currentContactIndex];
  const totalContacts = contacts.length;

  const handlePrevious = () => {
    if (currentContactIndex > 0) {
      setCurrentContactIndex(currentContactIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentContactIndex < totalContacts - 1) {
      setCurrentContactIndex(currentContactIndex + 1);
    }
  };

  const handleContactUpdate = (updatedContact: Contact) => {
    const updatedContacts = [...contacts];
    updatedContacts[currentContactIndex] = updatedContact;
    setContacts(updatedContacts);
  };

  const handleSave = () => {
    if (!currentContact) return;

    updateContact({
      id: currentContact.id,
      name: currentContact.name,
      email: currentContact.email,
      phone: currentContact.phone,
      city: currentContact.city,
      country: currentContact.country,
      address: currentContact.address,
      region: currentContact.region,
      postalCode: currentContact.postalCode,
      contactType: currentContact.contactType,
      domain: currentContact.domain,
      additionalPhones: currentContact.additionalPhones,
      taxId: currentContact.taxId,
      businessType: currentContact.businessType,
      employees: currentContact.employees,
    });
  };

  const handleSaveAll = async () => {
    for (const contact of contacts) {
      try {
        await new Promise((resolve, reject) => {
          updateContact(
            {
              id: contact.id,
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              city: contact.city,
              country: contact.country,
              address: contact.address,
              region: contact.region,
              postalCode: contact.postalCode,
              contactType: contact.contactType,
              domain: contact.domain,
              additionalPhones: contact.additionalPhones,
              taxId: contact.taxId,
              businessType: contact.businessType,
              employees: contact.employees,
            },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });
      } catch (error) {
        console.error('Error saving contact:', error);
        return; // Stop on first error
      }
    }
    onClose();
  };

  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`تعديل العملاء${totalContacts > 1 ? ` (${currentContactIndex + 1}/${totalContacts})` : ''}`}
    >
      <div className="p-4">
        {/* Navigation buttons for multiple contacts */}
        {totalContacts > 1 && (
          <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <button
              onClick={handlePrevious}
              disabled={currentContactIndex === 0}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500 px-2">
              {currentContactIndex + 1} من {totalContacts}
            </span>
            <button
              onClick={handleNext}
              disabled={currentContactIndex === totalContacts - 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="space-y-4">
          {isPending ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : currentContact ? (
            <>
              <EditContactForm contact={currentContact} onContactChange={handleContactUpdate} />
              {isUpdating && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 ml-2"></div>
                  <span className="text-sm text-gray-600">جارٍ الحفظ...</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">لم يتم العثور على بيانات العميل</div>
          )}
        </div>

        {/* Footer with buttons */}
        <div className="flex items-center justify-between w-full gap-3 pt-4 mt-4 border-t border-gray-100">
          <OButton variant="ghost" onClick={onClose}>
            إلغاء
          </OButton>

          <div className="flex gap-2">
            {totalContacts > 1 && (
              <OButton
                onClick={isUpdating ? () => {} : handleSaveAll}
                variant="secondary"
                className={isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {isUpdating ? 'جارٍ الحفظ...' : 'حفظ الكل'}
              </OButton>
            )}
            <OButton
              onClick={isUpdating || !currentContact ? () => {} : handleSave}
              variant="primary"
              className={isUpdating || !currentContact ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {isUpdating ? 'جارٍ الحفظ...' : 'حفظ'}
            </OButton>
          </div>
        </div>
      </div>
    </DashboardDialog>
  );
}
