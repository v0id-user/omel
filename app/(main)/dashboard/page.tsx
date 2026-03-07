'use client';

import { trpc } from '@/trpc/client';
import { Spinner } from '@/components/omel/Spinner';
import { toArabicNumerals } from '@/utils';
import { Calendar, Community, MultiplePagesEmpty, WarningTriangle } from 'iconoir-react';
import { ReactNode } from 'react';

function StatCard({ title, value, icon }: { title: string; value: number; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <div className="text-gray-600">{icon}</div>
      </div>
      <p className="mt-3 text-3xl font-semibold">{toArabicNumerals(value)}</p>
    </div>
  );
}

function formatArabicDate(date: Date | null) {
  if (!date) return 'بدون تاريخ';
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function DashboardPage() {
  const contactsRpc = trpc.crm.dashboard.contact.getByPage.useQuery({
    page: 1,
    limit: 5,
  });
  const tasksRpc = trpc.crm.dashboard.task.getTasks.useQuery();

  if (contactsRpc.isPending || tasksRpc.isPending) {
    return <Spinner />;
  }

  const contacts = contactsRpc.data?.data ?? [];
  const totalContacts = contactsRpc.data?.total ?? 0;
  const tasks = tasksRpc.data ?? [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const openTasks = tasks.filter(task => task.status !== 'completed').length;
  const now = new Date();
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate).getTime() < now.getTime();
  }).length;

  return (
    <div className="space-y-6 px-4 py-5" dir="rtl">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">مرحباً بك في لوحة التحكم</h1>
        <p className="text-sm text-gray-500">ملخص سريع لحالة العملاء والمهام داخل فريقك</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="إجمالي العملاء"
          value={totalContacts}
          icon={<Community className="h-5 w-5" />}
        />
        <StatCard
          title="إجمالي المهام"
          value={totalTasks}
          icon={<MultiplePagesEmpty className="h-5 w-5" />}
        />
        <StatCard
          title="المهام المفتوحة"
          value={openTasks}
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatCard
          title="المهام المتأخرة"
          value={overdueTasks}
          icon={<WarningTriangle className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-700">آخر العملاء</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {contacts.length === 0 ? (
              <p className="px-4 py-4 text-sm text-gray-500">لا يوجد عملاء حتى الآن</p>
            ) : (
              contacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.email || 'بدون بريد إلكتروني'}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatArabicDate(contact.createdAt || null)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-700">آخر المهام</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {tasks.length === 0 ? (
              <p className="px-4 py-4 text-sm text-gray-500">لا يوجد مهام حتى الآن</p>
            ) : (
              tasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {task.description || 'مهمة بدون وصف'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {task.clientName || 'بدون عميل'} · {task.assignedToName || 'غير معين'}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">
                      {formatArabicDate(task.dueDate || null)}
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {task.status === 'completed' ? 'مكتملة' : 'مفتوحة'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-700">مؤشر الإنجاز</h2>
        <p className="mt-2 text-sm text-gray-600">
          أنجزت{' '}
          <span className="font-semibold text-gray-900">{toArabicNumerals(completedTasks)}</span> من
          أصل <span className="font-semibold text-gray-900">{toArabicNumerals(totalTasks)}</span>{' '}
          مهمة.
        </p>
      </section>
    </div>
  );
}
