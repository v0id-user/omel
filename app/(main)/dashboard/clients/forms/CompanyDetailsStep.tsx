'use client';

import { FormField } from '@/components/omel/FormField';
import { StepProps } from '../types';
import { Input } from '@/components/ui/input';
import { companyFields } from '../config/fieldConfigs';
import { X } from 'lucide-react';

export function CompanyDetailsStep({
  clientData,
  onClientDataChange,
  errors,
  onAddPhone,
  onRemovePhone,
  onPhoneChange,
}: StepProps) {
  if (!onAddPhone || !onRemovePhone || !onPhoneChange || !clientData.companyFields) return null;

  // Function to get the value for a field based on its name
  const getFieldValue = (fieldName: string): string => {
    if (fieldName.includes('.')) {
      const [parent, child] = fieldName.split('.');
      if (parent === 'companyFields' && clientData.companyFields) {
        const value = clientData.companyFields[child as keyof typeof clientData.companyFields];
        // Check if the value is an array (like additionalPhones)
        if (Array.isArray(value)) {
          return '';
        }
        return value?.toString() || '';
      }
    }
    return fieldName === 'name' ? clientData.name : '';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium mb-4">معلومات الشركة</h2>

      {companyFields.map(field => (
        <FormField
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          value={getFieldValue(field.name)}
          onChange={value => onClientDataChange(field.name, value)}
          placeholder={field.placeholder || field.label}
          isRequired={field.isRequired}
          error={errors[field.name]}
        />
      ))}

      <div className="space-y-2">
        <h3 className="text-sm font-medium">أرقام هواتف إضافية</h3>
        {clientData.companyFields.additionalPhones.map((phone, index) => (
          <div key={index} className="flex gap-2">
            <Input
              type="text"
              placeholder={`رقم هاتف إضافي ${index + 1}`}
              value={phone}
              onChange={e => onPhoneChange(index, e.target.value)}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => onRemovePhone(index)}
                className="text-red-500 p-1 rounded-full hover:text-red-600 transition-colors text-xs cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={onAddPhone}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          + إضافة رقم هاتف آخر
        </button>
      </div>
    </div>
  );
}
