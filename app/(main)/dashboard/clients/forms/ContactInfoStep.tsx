'use client';

import { FormField } from '@/components/omel/FormField';
import { StepProps } from '../types';
import { contactInfoFields } from '../config/fieldConfigs';

export function ContactInfoStep({ clientData, onClientDataChange, errors }: StepProps) {
  // Filtering fields into main and grid sections
  const mainFields = contactInfoFields.filter(field => ['phone', 'address'].includes(field.name));
  const locationFields = contactInfoFields.filter(field => ['city', 'region'].includes(field.name));
  const postalFields = contactInfoFields.filter(field =>
    ['country', 'postalCode'].includes(field.name)
  );

  // Function to safely get field value, handling all possible types
  const getFieldValue = (fieldName: string): string => {
    const value = clientData[fieldName as keyof typeof clientData];

    // Skip object or array values
    if (typeof value === 'object' || Array.isArray(value)) {
      return '';
    }

    return value?.toString() || '';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium mb-4">معلومات الاتصال</h2>

      {mainFields.map(field => (
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

      <div className="grid grid-cols-2 gap-4">
        {locationFields.map(field => (
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        {postalFields.map(field => (
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
      </div>
    </div>
  );
}
