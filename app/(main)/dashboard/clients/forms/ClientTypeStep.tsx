'use client';

import { User, Building } from 'iconoir-react';
import { StepProps } from '../types';

export function ClientTypeStep({ clientData, onClientTypeChange }: StepProps) {
  if (!onClientTypeChange) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-center mb-6">اختر نوع العميل</h2>
      <div className="flex flex-col gap-4 items-center">
        <div
          className={`w-full p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition-all ${clientData.clientType === 'person' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
          onClick={() => onClientTypeChange('person')}
        >
          <User className="w-6 h-6" />
          <div>
            <h3 className="font-medium">شخص</h3>
            <p className="text-sm text-gray-600">إضافة شخص كعميل</p>
          </div>
        </div>

        <div
          className={`w-full p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition-all ${clientData.clientType === 'company' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
          onClick={() => onClientTypeChange('company')}
        >
          <Building className="w-6 h-6" />
          <div>
            <h3 className="font-medium">شركة</h3>
            <p className="text-sm text-gray-600">إضافة شركة كعميل</p>
          </div>
        </div>
      </div>
    </div>
  );
}
