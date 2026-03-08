'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardContent } from '@/components/dashboard';
import { DashboardDialog } from '@/components/dashboard/Dialog';
import { OButton } from '@/components/omel/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/omel/Spinner';
import { trpc } from '@/trpc/client';
import { INTERACTION_TYPES, InteractionType } from '@/database/types/interaction';
import { InteractionWithRelations } from '../types';
import { PlusCircle, Pencil, Phone, Trash2 } from 'lucide-react';
import { toArabicNumerals } from '@/utils';
import toast from 'react-hot-toast';

const interactionLabels: Record<string, string> = {
  note: 'ملاحظة',
  call: 'مكالمة',
  meeting: 'اجتماع',
  email: 'بريد',
  follow_up: 'متابعة',
};

const interactionColors: Record<string, string> = {
  note: 'bg-slate-100 text-slate-700',
  call: 'bg-blue-100 text-blue-700',
  meeting: 'bg-purple-100 text-purple-700',
  email: 'bg-amber-100 text-amber-700',
  follow_up: 'bg-emerald-100 text-emerald-700',
};

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return 'بدون تاريخ';
  }

  return new Date(date).toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type InteractionFormState = {
  type: InteractionType;
  subject: string;
  content: string;
  contactId: string;
  dealId: string;
  occurredAt: string;
};

function ActivityFormDialog({
  isOpen,
  onClose,
  interaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  interaction?: InteractionWithRelations | null;
}) {
  const utils = trpc.useUtils();
  const contactsQuery = trpc.crm.dashboard.contact.getBulk.useQuery(
    { limit: 100 },
    { enabled: isOpen }
  );
  const dealsQuery = trpc.crm.dashboard.deal.list.useQuery({ limit: 100 }, { enabled: isOpen });

  const createInteraction = trpc.crm.dashboard.interaction.new.useMutation({
    onSuccess: async () => {
      await utils.crm.dashboard.interaction.invalidate();
      toast.success('تم حفظ النشاط');
      onClose();
    },
    onError: error => {
      toast.error(error.message || 'تعذر حفظ النشاط');
    },
  });

  const updateInteraction = trpc.crm.dashboard.interaction.update.useMutation({
    onSuccess: async () => {
      await utils.crm.dashboard.interaction.invalidate();
      toast.success('تم تحديث النشاط');
      onClose();
    },
    onError: error => {
      toast.error(error.message || 'تعذر تحديث النشاط');
    },
  });

  const [form, setForm] = useState<InteractionFormState>({
    type: 'note',
    subject: '',
    content: '',
    contactId: '',
    dealId: '',
    occurredAt: '',
  });

  useEffect(() => {
    if (interaction) {
      setForm({
        type: interaction.type,
        subject: interaction.subject ?? '',
        content: interaction.content ?? '',
        contactId: interaction.contactId ?? '',
        dealId: interaction.dealId ?? '',
        occurredAt: interaction.occurredAt
          ? new Date(interaction.occurredAt).toISOString().slice(0, 16)
          : '',
      });
      return;
    }

    setForm({
      type: 'note',
      subject: '',
      content: '',
      contactId: '',
      dealId: '',
      occurredAt: '',
    });
  }, [interaction, isOpen]);

  const handleSubmit = () => {
    const payload = {
      type: form.type as InteractionWithRelations['type'],
      subject: form.subject || null,
      content: form.content || null,
      contactId: form.contactId || null,
      dealId: form.dealId || null,
      taskId: null,
      metadata: null,
      occurredAt: form.occurredAt ? new Date(form.occurredAt) : null,
    };

    if (!form.content.trim() && !form.subject.trim()) {
      toast.error('أدخل عنواناً أو محتوى للنشاط');
      return;
    }

    if (interaction) {
      updateInteraction.mutate({
        id: interaction.id,
        ...payload,
      });
      return;
    }

    createInteraction.mutate(payload);
  };

  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title={interaction ? 'تعديل النشاط' : 'نشاط جديد'}
      icon={<Phone className="h-4 w-4" />}
    >
      <div className="space-y-4 p-5" dir="rtl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">نوع النشاط</label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={form.type}
              onChange={event =>
                setForm(current => ({ ...current, type: event.target.value as InteractionType }))
              }
            >
              {INTERACTION_TYPES.map(type => (
                <option key={type} value={type}>
                  {interactionLabels[type]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">العنوان</label>
            <Input
              value={form.subject}
              onChange={event => setForm(current => ({ ...current, subject: event.target.value }))}
              placeholder="مثال: مكالمة تعريفية"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">التفاصيل</label>
          <Textarea
            value={form.content}
            onChange={event => setForm(current => ({ ...current, content: event.target.value }))}
            placeholder="أدخل تفاصيل النشاط"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">العميل</label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={form.contactId}
              onChange={event =>
                setForm(current => ({ ...current, contactId: event.target.value }))
              }
            >
              <option value="">بدون عميل</option>
              {(contactsQuery.data ?? []).map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">الصفقة</label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={form.dealId}
              onChange={event => setForm(current => ({ ...current, dealId: event.target.value }))}
            >
              <option value="">بدون صفقة</option>
              {(dealsQuery.data ?? []).map(deal => (
                <option key={deal.id} value={deal.id}>
                  {deal.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">تاريخ التنفيذ</label>
          <Input
            type="datetime-local"
            value={form.occurredAt}
            onChange={event => setForm(current => ({ ...current, occurredAt: event.target.value }))}
          />
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <OButton variant="ghost" onClick={onClose}>
            إلغاء
          </OButton>
          <OButton
            onClick={handleSubmit}
            isLoading={createInteraction.isPending || updateInteraction.isPending}
          >
            {interaction ? 'حفظ التعديلات' : 'إضافة النشاط'}
          </OButton>
        </div>
      </div>
    </DashboardDialog>
  );
}

export function ActivitiesPage() {
  const utils = trpc.useUtils();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<InteractionType | ''>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<InteractionWithRelations | null>(
    null
  );

  const activitiesQuery = trpc.crm.dashboard.interaction.list.useQuery({
    search: search.trim() || undefined,
    type: type || undefined,
    limit: 100,
  });

  const deleteInteraction = trpc.crm.dashboard.interaction.delete.useMutation({
    onSuccess: async () => {
      await utils.crm.dashboard.interaction.invalidate();
      toast.success('تم حذف النشاط');
    },
    onError: error => {
      toast.error(error.message || 'تعذر حذف النشاط');
    },
  });

  const summary = useMemo(() => {
    const items = activitiesQuery.data ?? [];
    return INTERACTION_TYPES.map(currentType => ({
      type: currentType,
      count: items.filter(item => item.type === currentType).length,
    }));
  }, [activitiesQuery.data]);

  return (
    <DashboardContent
      title="الأنشطة"
      ctaLabel="نشاط جديد"
      ctaIcon={<PlusCircle className="h-4 w-4" />}
      onCtaClick={() => {
        setSelectedInteraction(null);
        setIsDialogOpen(true);
      }}
      emptyState={{
        text: 'سجّل المكالمات والاجتماعات والملاحظات لتبقى كل التفاصيل في مكان واحد.',
        icon: <Phone className="h-16 w-16 text-gray-300" />,
      }}
      dialogs={
        <ActivityFormDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          interaction={selectedInteraction}
        />
      }
    >
      {activitiesQuery.isPending ? (
        <Spinner />
      ) : (
        <div className="space-y-6 px-4 py-5" dir="rtl">
          <div className="grid gap-4 md:grid-cols-5">
            {summary.map(item => (
              <div key={item.type} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">{interactionLabels[item.type]}</p>
                <p className="mt-2 text-2xl font-semibold">{toArabicNumerals(item.count)}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2">
            <Input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="ابحث في الأنشطة أو العملاء أو الصفقات"
            />
            <select
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={type}
              onChange={event => setType(event.target.value as InteractionType | '')}
            >
              <option value="">كل الأنشطة</option>
              {INTERACTION_TYPES.map(currentType => (
                <option key={currentType} value={currentType}>
                  {interactionLabels[currentType]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {(activitiesQuery.data ?? []).map(interaction => (
              <article
                key={interaction.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-medium ${interactionColors[interaction.type]}`}
                      >
                        {interactionLabels[interaction.type]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(interaction.occurredAt)}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {interaction.subject || 'نشاط بدون عنوان'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {interaction.content || 'بدون تفاصيل إضافية'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>العميل: {interaction.contactName || 'غير مرتبط'}</span>
                      <span>الصفقة: {interaction.dealTitle || 'غير مرتبطة'}</span>
                      <span>بواسطة: {interaction.authorName || 'الفريق'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <OButton
                      variant="ghost"
                      onClick={() => {
                        setSelectedInteraction(interaction);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </OButton>
                    <OButton
                      variant="danger"
                      onClick={() => deleteInteraction.mutate({ id: interaction.id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </OButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </DashboardContent>
  );
}

export default ActivitiesPage;
