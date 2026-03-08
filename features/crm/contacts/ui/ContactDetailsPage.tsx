'use client';

import Link from 'next/link';
import { trpc } from '@/trpc/client';
import { Spinner } from '@/components/omel/Spinner';
import { toArabicNumerals } from '@/utils';
import { ArrowRight, Mail, Phone, Building2, BriefcaseBusiness, Activity } from 'lucide-react';

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return 'غير متاح';
  }

  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const contactStatusLabels: Record<string, string> = {
  lead: 'مهتم',
  prospect: 'فرصة',
  customer: 'عميل',
  inactive: 'غير نشط',
};

const contactSourceLabels: Record<string, string> = {
  website: 'الموقع',
  referral: 'إحالة',
  social_media: 'وسائل التواصل',
  campaign: 'حملة',
  event: 'فعالية',
  email: 'البريد',
  phone: 'الهاتف',
  manual: 'إدخال يدوي',
  other: 'أخرى',
};

export function ContactDetailsPage({ contactId }: { contactId: string }) {
  const contactQuery = trpc.crm.dashboard.contact.getByIds.useQuery({ ids: [contactId] });
  const dealsQuery = trpc.crm.dashboard.deal.getByContact.useQuery({ contactId });
  const activitiesQuery = trpc.crm.dashboard.interaction.list.useQuery({ contactId, limit: 100 });
  const tasksQuery = trpc.crm.dashboard.task.getTasks.useQuery();

  if (
    contactQuery.isPending ||
    dealsQuery.isPending ||
    activitiesQuery.isPending ||
    tasksQuery.isPending
  ) {
    return <Spinner />;
  }

  const contact = contactQuery.data?.[0];

  if (!contact) {
    return (
      <div className="space-y-4 px-4 py-5" dir="rtl">
        <p className="text-sm text-gray-500">لم يتم العثور على هذا العميل.</p>
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-2 text-sm font-medium"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى قائمة العملاء
        </Link>
      </div>
    );
  }

  const linkedTasks = (tasksQuery.data ?? []).filter(task => task.relatedTo === contact.id);

  return (
    <div className="space-y-6 px-4 py-5" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{contact.name}</h1>
          <p className="text-sm text-gray-500">
            ملف موحد للعميل يضم الصفقات والأنشطة والمهام المرتبطة.
          </p>
        </div>
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى العملاء
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">الصفقات المرتبطة</p>
          <p className="mt-3 text-2xl font-semibold">
            {toArabicNumerals(dealsQuery.data?.length ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">الأنشطة المسجلة</p>
          <p className="mt-3 text-2xl font-semibold">
            {toArabicNumerals(activitiesQuery.data?.length ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">المهام المفتوحة</p>
          <p className="mt-3 text-2xl font-semibold">
            {toArabicNumerals(linkedTasks.filter(task => task.status !== 'completed').length)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">آخر تواصل</p>
          <p className="mt-3 text-lg font-semibold">{formatDate(contact.lastContactedAt)}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">الملف الأساسي</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {contact.email || 'غير متاح'}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-500">رقم الهاتف</p>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {contact.phone || 'غير متاح'}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">الحالة</p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {contactStatusLabels[contact.status] || contact.status}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">المصدر</p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {contactSourceLabels[contact.source || 'other'] || 'أخرى'}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 md:col-span-2">
              <p className="text-sm text-gray-500">العنوان</p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {contact.address || contact.city || contact.country
                  ? [contact.address, contact.city, contact.region, contact.country]
                      .filter(Boolean)
                      .join('، ')
                  : 'غير متاح'}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 md:col-span-2">
              <p className="text-sm text-gray-500">ملاحظات داخلية</p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {contact.notes || 'لا توجد ملاحظات حالياً'}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">الصفقات المفتوحة والمغلقة</h2>
          </div>
          <div className="space-y-3">
            {(dealsQuery.data ?? []).length === 0 ? (
              <p className="text-sm text-gray-500">لا توجد صفقات مرتبطة بهذا العميل.</p>
            ) : (
              (dealsQuery.data ?? []).map(deal => (
                <div key={deal.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{deal.title}</p>
                      <p className="text-sm text-gray-500">
                        {deal.amount} {deal.currency}
                      </p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                      {deal.stage}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    الإغلاق المتوقع: {formatDate(deal.expectedCloseDate)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">آخر الأنشطة</h2>
          </div>
          <div className="space-y-3">
            {(activitiesQuery.data ?? []).length === 0 ? (
              <p className="text-sm text-gray-500">لا توجد أنشطة مرتبطة بهذا العميل.</p>
            ) : (
              (activitiesQuery.data ?? []).slice(0, 6).map(activity => (
                <div key={activity.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-gray-900">{activity.subject || activity.type}</p>
                    <span className="text-xs text-gray-500">{formatDate(activity.occurredAt)}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {activity.content || 'بدون تفاصيل إضافية'}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">المهام المرتبطة</h2>
          </div>
          <div className="space-y-3">
            {linkedTasks.length === 0 ? (
              <p className="text-sm text-gray-500">لا توجد مهام مرتبطة بهذا العميل.</p>
            ) : (
              linkedTasks.map(task => (
                <div key={task.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-gray-900">
                      {task.description || 'مهمة بدون وصف'}
                    </p>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                      {task.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    الاستحقاق: {formatDate(task.dueDate)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactDetailsPage;
