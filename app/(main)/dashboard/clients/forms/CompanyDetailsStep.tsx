'use client';

import { Input } from '@/components/ui/input';
import { StepProps } from '../types';

export function CompanyDetailsStep({
  clientData,
  onClientDataChange,
  errors,
  onAddPhone,
  onRemovePhone,
  onPhoneChange,
}: StepProps) {
  if (!onAddPhone || !onRemovePhone || !onPhoneChange || !clientData.companyFields) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium mb-4">معلومات الشركة</h2>
      <div>
        <Input
          type="text"
          placeholder="الموقع الإلكتروني"
          value={clientData.companyFields.domain || ''}
          onChange={e => onClientDataChange('companyFields.domain', e.target.value)}
          className={errors['companyFields.domain'] ? 'border-red-500' : ''}
        />
        {errors['companyFields.domain'] && (
          <p className="text-red-500 text-sm mt-1">{errors['companyFields.domain']}</p>
        )}
      </div>

      <Input
        type="text"
        placeholder="الرقم الضريبي"
        value={clientData.companyFields.taxId || ''}
        onChange={e => onClientDataChange('companyFields.taxId', e.target.value)}
      />

      <Input
        type="text"
        placeholder="نوع النشاط التجاري"
        value={clientData.companyFields.businessType || ''}
        onChange={e => onClientDataChange('companyFields.businessType', e.target.value)}
      />

      <Input
        type="text"
        placeholder="عدد الموظفين"
        value={clientData.companyFields.employees || ''}
        onChange={e => onClientDataChange('companyFields.employees', e.target.value)}
      />

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
                className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200"
              >
                حذف
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
