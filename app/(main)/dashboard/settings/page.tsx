'use client';

import { authClient } from '@/lib/betterauth/auth-client';
import { Spinner } from '@/components/omel/Spinner';
import { OButton } from '@/components/omel/Button';
import { trpc } from '@/trpc/client';
import { toArabicNumerals } from '@/utils';
import { CreditCard, Building2, Activity, BriefcaseBusiness } from 'lucide-react';

export default function SettingsPage() {
  const { data: activeOrganization, isPending } = authClient.useActiveOrganization();
  const contactsQuery = trpc.crm.dashboard.contact.getByPage.useQuery({ page: 1, limit: 1 });
  const tasksQuery = trpc.crm.dashboard.task.getTasks.useQuery();
  const dealsSummaryQuery = trpc.crm.dashboard.deal.summary.useQuery();

  if (isPending || contactsQuery.isPending || tasksQuery.isPending || dealsSummaryQuery.isPending) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6 px-4 py-5" dir="rtl">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">الإعدادات والاشتراك</h1>
        <p className="text-sm text-gray-500">
          راقب حالة المساحة الحالية وروابط الفوترة والاعتماد التشغيلي.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">إجمالي العملاء</p>
          <p className="mt-3 text-2xl font-semibold">
            {toArabicNumerals(contactsQuery.data?.total ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">إجمالي المهام</p>
          <p className="mt-3 text-2xl font-semibold">
            {toArabicNumerals(tasksQuery.data?.length ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">الصفقات المفتوحة</p>
          <p className="mt-3 text-2xl font-semibold">
            {toArabicNumerals(dealsSummaryQuery.data?.open ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">الصفقات المغلقة فوز</p>
          <p className="mt-3 text-2xl font-semibold">
            {toArabicNumerals(dealsSummaryQuery.data?.won ?? 0)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">بيانات المساحة</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-gray-500">اسم المساحة</p>
              <p className="mt-1 font-medium text-gray-900">{activeOrganization?.name}</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-gray-500">الرابط المختصر</p>
              <p className="mt-1 font-medium text-gray-900">
                {activeOrganization?.slug || 'غير متاح'}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-gray-500">معرف المساحة</p>
              <p className="mt-1 break-all font-medium text-gray-900">{activeOrganization?.id}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">الفوترة والنمو</h2>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">
              استخدم بوابة العملاء لإدارة الاشتراك وطرق الدفع عند تفعيل الربط المالي.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="/api/auth/customer/portal" target="_blank" rel="noreferrer">
                <OButton>
                  <CreditCard className="h-4 w-4" />
                  فتح بوابة الفوترة
                </OButton>
              </a>
              <a href="/dashboard/deals">
                <OButton variant="secondary">
                  <BriefcaseBusiness className="h-4 w-4" />
                  متابعة خط الصفقات
                </OButton>
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-700" />
              <p className="font-medium text-gray-900">نظرة تشغيلية</p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>المساحة الحالية تدير {toArabicNumerals(contactsQuery.data?.total ?? 0)} عميل.</li>
              <li>هناك {toArabicNumerals(tasksQuery.data?.length ?? 0)} مهمة مرتبطة بسير العمل.</li>
              <li>
                قيمة خط الصفقات الحالي:{' '}
                {toArabicNumerals(dealsSummaryQuery.data?.pipelineValue ?? 0)} ر.س
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
