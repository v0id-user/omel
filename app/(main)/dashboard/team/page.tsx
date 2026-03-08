'use client';

import { authClient } from '@/lib/betterauth/auth-client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Spinner } from '@/components/omel/Spinner';
import { toArabicNumerals } from '@/utils';
import { Users, Building2 } from 'lucide-react';

export default function TeamPage() {
  const { data: activeOrganization, isPending } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  if (isPending) {
    return <Spinner />;
  }

  const members = activeOrganization?.members ?? [];

  return (
    <div className="space-y-6 px-4 py-5" dir="rtl">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">الفريق والمساحة</h1>
        <p className="text-sm text-gray-500">
          تعرّف على أعضاء الفريق النشطين داخل مساحة العمل الحالية.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">المساحة الحالية</p>
          <p className="mt-3 text-xl font-semibold">{activeOrganization?.name || 'غير متاحة'}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">عدد الأعضاء</p>
          <p className="mt-3 flex items-center gap-2 text-2xl font-semibold">
            <Users className="h-5 w-5 text-blue-600" />
            {toArabicNumerals(members.length)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">عدد المساحات المتاحة</p>
          <p className="mt-3 flex items-center gap-2 text-2xl font-semibold">
            <Building2 className="h-5 w-5 text-gray-700" />
            {toArabicNumerals(organizations?.length ?? 0)}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-4 space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">أعضاء الفريق</h2>
          <p className="text-sm text-gray-500">
            الأعضاء الذين يمكنهم الوصول إلى هذه المساحة حالياً.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map(member => (
            <div key={member.id} className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{member.user.name}</p>
                  <p className="text-sm text-gray-500">{member.user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>الدور</span>
                <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium">
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">بيانات المساحة</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">المعرف</p>
            <p className="mt-2 break-all text-sm font-medium text-gray-900">
              {activeOrganization?.id || 'غير متاح'}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">الرابط المختصر</p>
            <p className="mt-2 text-sm font-medium text-gray-900">
              {activeOrganization?.slug || 'غير متاح'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
