'use client';

import { Input } from '@/components/ui/input';
import { StepProps } from '../types';

export function BasicInfoStep({ clientData, onClientDataChange, errors }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium mb-4">المعلومات الأساسية</h2>
      <div>
        <Input
          type="text"
          placeholder={clientData.clientType === 'person' ? 'الاسم الكامل' : 'اسم الشركة'}
          value={clientData.name}
          onChange={e => onClientDataChange('name', e.target.value)}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <Input
          type="email"
          placeholder="البريد الإلكتروني"
          value={clientData.email}
          onChange={e => onClientDataChange('email', e.target.value)}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
    </div>
  );
}
