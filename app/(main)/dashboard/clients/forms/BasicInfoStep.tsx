'use client';

import { FormField } from '@/components/omel/FormField';
import { StepProps } from '../types';
import { basicInfoFields } from '../config/fieldConfigs';

export function BasicInfoStep({ clientData, onClientDataChange, errors }: StepProps) {
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
      <h2 className="text-xl font-medium mb-4">المعلومات الأساسية</h2>

      {basicInfoFields.map(field => (
        <FormField
          key={field.name}
          label={
            field.name === 'name'
              ? clientData.clientType === 'person'
                ? 'الاسم الكامل'
                : 'اسم الشركة'
              : field.label
          }
          name={field.name}
          type={field.type}
          value={getFieldValue(field.name)}
          onChange={value => onClientDataChange(field.name, value)}
          placeholder={
            field.name === 'name'
              ? clientData.clientType === 'person'
                ? 'الاسم الكامل'
                : 'اسم الشركة'
              : field.placeholder || field.label
          }
          isRequired={field.isRequired}
          error={errors[field.name]}
        />
      ))}
    </div>
  );
}
