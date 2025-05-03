'use client';

import { StepProps } from '../types';

export function CompletionStep({ clientData }: StepProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 flex flex-col items-center">
        <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mb-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 13L9 17L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold">تم تجهيز البيانات</h2>
        <p className="text-sm">كل شيء جاهز لإضافة العميل الجديد</p>
      </div>

      <div className="text-right bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">ملخص المعلومات</h3>
        <p>
          <span className="font-medium">نوع العميل:</span>{' '}
          {clientData.clientType === 'person' ? 'شخص' : 'شركة'}
        </p>
        <p>
          <span className="font-medium">الاسم:</span> {clientData.name}
        </p>
        <p>
          <span className="font-medium">البريد الإلكتروني:</span> {clientData.email}
        </p>
        <p>
          <span className="font-medium">رقم الهاتف:</span> {clientData.phone}
        </p>
      </div>
    </div>
  );
}
