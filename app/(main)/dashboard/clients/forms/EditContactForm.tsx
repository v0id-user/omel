'use client';

import { FormField } from '@/components/omel/FormField';
import { useState } from 'react';
import { clientValidateEmailInput, clientValidatePhoneInput } from '@/utils/client/validators';
import { Input } from '@/components/ui/input';
import { X, Building, User } from 'lucide-react';
import { OButton } from '@/components/omel/Button';
import { Contact } from '@/database/types/contacts';

interface EditContactFormProps {
  contact: Contact;
  onContactChange: (updatedContact: Contact) => void;
}

export function EditContactForm({ contact, onContactChange }: EditContactFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: string, value: string) => {
    const updatedContact = { ...contact, [field]: value };
    onContactChange(updatedContact);

    // Validate field and set error
    const error = validateField(field, value);
    setErrors({ ...errors, [field]: error || '' });
  };

  const handleAddPhone = () => {
    const currentPhones = contact.additionalPhones || [];
    const updatedContact = {
      ...contact,
      additionalPhones: [...currentPhones, ''],
    };
    onContactChange(updatedContact);
  };

  const handleRemovePhone = (index: number) => {
    const currentPhones = contact.additionalPhones || [];
    const newPhones = [...currentPhones];
    newPhones.splice(index, 1);
    const updatedContact = {
      ...contact,
      additionalPhones: newPhones.length > 0 ? newPhones : null,
    };
    onContactChange(updatedContact);
  };

  const handlePhoneChange = (index: number, value: string) => {
    const currentPhones = contact.additionalPhones || [];
    const newPhones = [...currentPhones];
    newPhones[index] = value;
    const updatedContact = {
      ...contact,
      additionalPhones: newPhones,
    };
    onContactChange(updatedContact);
  };

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value) return 'الاسم مطلوب';
        break;
      case 'email':
        if (!value) return 'البريد الإلكتروني مطلوب';
        return clientValidateEmailInput(value);
      case 'phone':
        if (value) return clientValidatePhoneInput(value);
        break;
      default:
        break;
    }
    return undefined;
  };

  return (
    <div className="space-y-5">
      {/* Header with contact name */}
      <div className="text-center pb-3 border-b border-gray-100">
        <div className="flex items-center justify-center gap-2">
          {contact.contactType === 'company' ? (
            <Building className="w-4 h-4 text-gray-700" />
          ) : (
            <User className="w-4 h-4 text-gray-700" />
          )}
          <h3 className="text-sm font-medium text-gray-700">{contact.name}</h3>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          المعلومات الأساسية
        </h4>

        <FormField
          label={contact.contactType === 'company' ? 'اسم الشركة' : 'الاسم الكامل'}
          name="name"
          type="text"
          value={contact.name || ''}
          onChange={value => handleFieldChange('name', value)}
          placeholder={contact.contactType === 'company' ? 'اسم الشركة' : 'الاسم الكامل'}
          isRequired={true}
          error={errors.name}
        />

        <FormField
          label="البريد الإلكتروني"
          name="email"
          type="email"
          value={contact.email || ''}
          onChange={value => handleFieldChange('email', value)}
          placeholder="البريد الإلكتروني"
          isRequired={true}
          error={errors.email}
        />

        <FormField
          label="رقم الهاتف"
          name="phone"
          type="phone"
          value={contact.phone || ''}
          onChange={value => handleFieldChange('phone', value)}
          placeholder="رقم الهاتف"
          isRequired={false}
          error={errors.phone}
        />
      </div>

      {/* Contact Information */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          معلومات الاتصال
        </h4>

        <FormField
          label="العنوان"
          name="address"
          type="text"
          value={contact.address || ''}
          onChange={value => handleFieldChange('address', value)}
          placeholder="العنوان"
          isRequired={false}
          error={errors.address}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="المدينة"
            name="city"
            type="text"
            value={contact.city || ''}
            onChange={value => handleFieldChange('city', value)}
            placeholder="المدينة"
            isRequired={false}
            error={errors.city}
          />

          <FormField
            label="المنطقة"
            name="region"
            type="text"
            value={contact.region || ''}
            onChange={value => handleFieldChange('region', value)}
            placeholder="المنطقة"
            isRequired={false}
            error={errors.region}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="البلد"
            name="country"
            type="text"
            value={contact.country || ''}
            onChange={value => handleFieldChange('country', value)}
            placeholder="البلد"
            isRequired={false}
            error={errors.country}
          />

          <FormField
            label="الرمز البريدي"
            name="postalCode"
            type="text"
            value={contact.postalCode || ''}
            onChange={value => handleFieldChange('postalCode', value)}
            placeholder="الرمز البريدي"
            isRequired={false}
            error={errors.postalCode}
          />
        </div>
      </div>

      {/* Company-specific fields */}
      {contact.contactType === 'company' && (
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            معلومات الشركة
          </h4>

          <FormField
            label="الموقع الإلكتروني"
            name="domain"
            type="url"
            value={contact.domain || ''}
            onChange={value => handleFieldChange('domain', value)}
            placeholder="https://example.com"
            isRequired={false}
            error={errors.domain}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="الرقم الضريبي"
              name="taxId"
              type="text"
              value={contact.taxId || ''}
              onChange={value => handleFieldChange('taxId', value)}
              placeholder="الرقم الضريبي"
              isRequired={false}
              error={errors.taxId}
            />

            <FormField
              label="نوع النشاط التجاري"
              name="businessType"
              type="text"
              value={contact.businessType || ''}
              onChange={value => handleFieldChange('businessType', value)}
              placeholder="نوع النشاط التجاري"
              isRequired={false}
              error={errors.businessType}
            />
          </div>

          <FormField
            label="عدد الموظفين"
            name="employees"
            type="text"
            value={contact.employees || ''}
            onChange={value => handleFieldChange('employees', value)}
            placeholder="عدد الموظفين"
            isRequired={false}
            error={errors.employees}
          />

          {/* Additional Phones */}
          <div className="space-y-2">
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              أرقام هواتف إضافية
            </h5>
            {(contact.additionalPhones || []).map((phone, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="text"
                  placeholder={`رقم هاتف إضافي ${index + 1}`}
                  value={phone}
                  onChange={e => handlePhoneChange(index, e.target.value)}
                  className="flex-1"
                />
                <OButton
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemovePhone(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </OButton>
              </div>
            ))}
            <OButton
              variant="ghost"
              size="sm"
              onClick={handleAddPhone}
              className="text-blue-600 hover:text-blue-800"
            >
              + إضافة رقم هاتف آخر
            </OButton>
          </div>
        </div>
      )}
    </div>
  );
}
