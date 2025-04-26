import { Switch } from '@/components/omel/Switch';

export default function TestSwitch() {
  return (
    <div className="flex flex-col items-start gap-8 p-8 rtl">
      <h1 className="text-2xl font-bold mb-4">أمثلة مكون التبديل</h1>

      {/* الأزرار الافتراضية */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">الأزرار الافتراضية</h2>
        <div className="space-y-2">
          <Switch checked label="مفعل افتراضي" />
          <Switch label="غير مفعل افتراضي" />
          <Switch checked disabled label="مفعل غير متاح" />
        </div>
      </div>

      {/* أزرار بتنسيق مخصص */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">تنسيقات مخصصة للنصوص</h2>
        <div className="space-y-2">
          <Switch
            checked
            label="نص كبير باللون الأحمر"
            labelClassName="text-red-500 text-lg font-bold"
          />
          <Switch label="مسافة مخصصة" containerClassName="gap-6" labelClassName="text-blue-600" />
          <Switch
            checked
            label="نص بتنسيق خاص"
            labelClassName="text-xl text-green-600"
            containerClassName="gap-4"
          />
        </div>
      </div>

      {/* أحجام مختلفة */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">أحجام مختلفة</h2>
        <div className="space-y-2">
          <Switch size="16" checked label="زر صغير (١٦ بكسل)" labelClassName="text-gray-600" />
          <Switch size="24" checked label="زر كبير (٢٤ بكسل)" labelClassName="text-gray-600" />
        </div>
      </div>

      {/* تنسيقات متنوعة */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">تنسيقات متنوعة</h2>
        <div className="space-y-2">
          <Switch
            checked
            label="نص بنفسجي كبير"
            labelClassName="text-purple-600 text-lg"
            containerClassName="gap-4"
          />
          <Switch
            label="مسافة كبيرة بين العناصر"
            labelClassName="text-orange-500"
            containerClassName="gap-8"
          />
          <Switch
            checked
            label="نص غامق"
            labelClassName="font-bold text-gray-800"
            containerClassName="gap-4"
          />
        </div>
      </div>
    </div>
  );
}
