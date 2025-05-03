'use client';

import { Input } from '@/components/ui/input';
import { StepProps } from '../types';

export function ContactInfoStep({ clientData, onClientDataChange, errors }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium mb-4">معلومات الاتصال</h2>
      <div>
        <Input
          type="text"
          placeholder="رقم الهاتف"
          value={clientData.phone}
          onChange={e => onClientDataChange('phone', e.target.value)}
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <Input
        type="text"
        placeholder="العنوان"
        value={clientData.address}
        onChange={e => onClientDataChange('address', e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="المدينة"
          value={clientData.city}
          onChange={e => onClientDataChange('city', e.target.value)}
        />
        <Input
          type="text"
          placeholder="المنطقة"
          value={clientData.region}
          onChange={e => onClientDataChange('region', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="البلد"
          value={clientData.country}
          onChange={e => onClientDataChange('country', e.target.value)}
        />
        <Input
          type="text"
          placeholder="الرمز البريدي"
          value={clientData.postalCode}
          onChange={e => onClientDataChange('postalCode', e.target.value)}
        />
      </div>
    </div>
  );
}
