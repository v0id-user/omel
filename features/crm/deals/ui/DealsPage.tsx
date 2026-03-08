'use client';

import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, Trash2, Pencil, TrendingUp, Trophy, Circle } from 'lucide-react';
import { DashboardContent } from '@/components/dashboard';
import { DashboardDialog } from '@/components/dashboard/Dialog';
import { OButton } from '@/components/omel/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/omel/Spinner';
import { trpc } from '@/trpc/client';
import { authClient } from '@/lib/betterauth/auth-client';
import { useUserInfoStore } from '@/store/persist/userInfo';
import { DealWithRelations } from '../types';
import { DEAL_STAGES, DealStage, DealStatus } from '@/database/types/deal';
import { SaudiRiyalAmount } from '@/components/ui/saudi-riyal';
import { toArabicNumerals } from '@/utils';
import toast from 'react-hot-toast';

const stageLabels: Record<string, string> = {
  lead: 'فرصة جديدة',
  qualified: 'مؤهلة',
  proposal: 'عرض سعر',
  negotiation: 'تفاوض',
  won: 'مغلقة - فوز',
  lost: 'مغلقة - خسارة',
};

const statusLabels: Record<string, string> = {
  open: 'مفتوحة',
  won: 'فوز',
  lost: 'خسارة',
  archived: 'مؤرشفة',
};

const stageColors: Record<string, string> = {
  lead: 'bg-slate-100 text-slate-700',
  qualified: 'bg-blue-100 text-blue-700',
  proposal: 'bg-amber-100 text-amber-700',
  negotiation: 'bg-purple-100 text-purple-700',
  won: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-rose-100 text-rose-700',
};

function formatCurrency(amount: string, currency: string) {
  if (currency === 'SAR') {
    return <SaudiRiyalAmount amount={amount} symbolSize={0.95} />;
  }

  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return 'بدون موعد';
  }

  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

type DealFormState = {
  title: string;
  description: string;
  amount: string;
  currency: string;
  stage: DealStage;
  status: DealStatus;
  probability: string;
  expectedCloseDate: string;
  contactId: string;
  ownerId: string;
};

function DealFormDialog({
  isOpen,
  onClose,
  deal,
}: {
  isOpen: boolean;
  onClose: () => void;
  deal?: DealWithRelations | null;
}) {
  const utils = trpc.useUtils();
  const userInfo = useUserInfoStore();
  const { data: organization } = authClient.useActiveOrganization();
  const contactsQuery = trpc.crm.dashboard.contact.getBulk.useQuery(
    { limit: 100 },
    { enabled: isOpen }
  );

  const createDeal = trpc.crm.dashboard.deal.new.useMutation({
    onSuccess: async () => {
      await utils.crm.dashboard.deal.invalidate();
      toast.success('تم حفظ الصفقة بنجاح');
      onClose();
    },
    onError: error => {
      toast.error(error.message || 'تعذر حفظ الصفقة');
    },
  });

  const updateDeal = trpc.crm.dashboard.deal.update.useMutation({
    onSuccess: async () => {
      await utils.crm.dashboard.deal.invalidate();
      toast.success('تم تحديث الصفقة بنجاح');
      onClose();
    },
    onError: error => {
      toast.error(error.message || 'تعذر تحديث الصفقة');
    },
  });

  const members =
    organization?.members.map(member => ({
      id: member.userId,
      name: member.user.name,
    })) ?? [];

  const defaultOwnerId = userInfo.getUserInfo()?.userId ?? members[0]?.id ?? '';

  const [form, setForm] = useState<DealFormState>({
    title: '',
    description: '',
    amount: '0',
    currency: 'SAR',
    stage: 'lead',
    status: 'open',
    probability: '0',
    expectedCloseDate: '',
    contactId: '',
    ownerId: defaultOwnerId,
  });

  useEffect(() => {
    if (deal) {
      setForm({
        title: deal.title,
        description: deal.description ?? '',
        amount: deal.amount ?? '0',
        currency: deal.currency ?? 'SAR',
        stage: deal.stage,
        status: deal.status,
        probability: String(deal.probability ?? 0),
        expectedCloseDate: deal.expectedCloseDate
          ? new Date(deal.expectedCloseDate).toISOString().slice(0, 10)
          : '',
        contactId: deal.contactId ?? '',
        ownerId: deal.ownerId,
      });
      return;
    }

    setForm({
      title: '',
      description: '',
      amount: '0',
      currency: 'SAR',
      stage: 'lead',
      status: 'open',
      probability: '0',
      expectedCloseDate: '',
      contactId: '',
      ownerId: defaultOwnerId,
    });
  }, [deal, defaultOwnerId, isOpen]);

  const handleSubmit = () => {
    const payload = {
      title: form.title,
      description: form.description || null,
      amount: form.amount,
      currency: form.currency,
      stage: form.stage as DealWithRelations['stage'],
      status: form.status as DealWithRelations['status'],
      probability: Number(form.probability || 0),
      expectedCloseDate: form.expectedCloseDate ? new Date(form.expectedCloseDate) : null,
      contactId: form.contactId || null,
      ownerId: form.ownerId,
      tags: null,
    };

    if (!form.title.trim()) {
      toast.error('عنوان الصفقة مطلوب');
      return;
    }

    if (deal) {
      updateDeal.mutate({
        id: deal.id,
        ...payload,
      });
      return;
    }

    createDeal.mutate(payload);
  };

  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? 'تعديل الصفقة' : 'صفقة جديدة'}
      icon={<TrendingUp className="h-4 w-4" />}
    >
      <div className="space-y-4 p-5" dir="rtl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">عنوان الصفقة</label>
            <Input
              value={form.title}
              onChange={event => setForm(current => ({ ...current, title: event.target.value }))}
              placeholder="مثال: اشتراك سنوي"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">القيمة</label>
            <Input
              value={form.amount}
              onChange={event => setForm(current => ({ ...current, amount: event.target.value }))}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">الوصف</label>
          <Textarea
            value={form.description}
            onChange={event =>
              setForm(current => ({ ...current, description: event.target.value }))
            }
            placeholder="ملخص سريع عن الصفقة"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">المرحلة</label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={form.stage}
              onChange={event =>
                setForm(current => ({ ...current, stage: event.target.value as DealStage }))
              }
            >
              {DEAL_STAGES.map(stage => (
                <option key={stage} value={stage}>
                  {stageLabels[stage]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">الحالة</label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={form.status}
              onChange={event =>
                setForm(current => ({ ...current, status: event.target.value as DealStatus }))
              }
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
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
            <label className="text-sm font-medium">مالك الصفقة</label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={form.ownerId}
              onChange={event => setForm(current => ({ ...current, ownerId: event.target.value }))}
            >
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">نسبة الإغلاق المتوقعة</label>
            <Input
              value={form.probability}
              onChange={event =>
                setForm(current => ({ ...current, probability: event.target.value }))
              }
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">تاريخ الإغلاق المتوقع</label>
            <Input
              type="date"
              value={form.expectedCloseDate}
              onChange={event =>
                setForm(current => ({ ...current, expectedCloseDate: event.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <OButton variant="ghost" onClick={onClose}>
            إلغاء
          </OButton>
          <OButton onClick={handleSubmit} isLoading={createDeal.isPending || updateDeal.isPending}>
            {deal ? 'حفظ التعديلات' : 'إنشاء الصفقة'}
          </OButton>
        </div>
      </div>
    </DashboardDialog>
  );
}

function DealCard({
  deal,
  onEdit,
  onDelete,
  onStageChange,
}: {
  deal: DealWithRelations;
  onEdit: (deal: DealWithRelations) => void;
  onDelete: (dealId: string) => void;
  onStageChange: (deal: DealWithRelations, stage: string) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-900">{deal.title}</h3>
          <p className="text-xs text-gray-500">{deal.contactName || 'بدون عميل مرتبط'}</p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-[11px] font-medium ${stageColors[deal.stage]}`}
        >
          {stageLabels[deal.stage]}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        <p>{formatCurrency(deal.amount, deal.currency)}</p>
        <p>المالك: {deal.ownerName || 'غير محدد'}</p>
        <p>الإغلاق المتوقع: {formatDate(deal.expectedCloseDate)}</p>
        <p>الحالة: {statusLabels[deal.status]}</p>
      </div>

      <div className="space-y-2">
        <select
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
          value={deal.stage}
          onChange={event => onStageChange(deal, event.target.value)}
        >
          {DEAL_STAGES.map(stage => (
            <option key={stage} value={stage}>
              {stageLabels[stage]}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <OButton variant="ghost" className="flex-1 justify-center" onClick={() => onEdit(deal)}>
            <Pencil className="h-4 w-4" />
            تعديل
          </OButton>
          <OButton
            variant="danger"
            className="flex-1 justify-center"
            onClick={() => onDelete(deal.id)}
          >
            <Trash2 className="h-4 w-4" />
            حذف
          </OButton>
        </div>
      </div>
    </div>
  );
}

export function DealsPage() {
  const utils = trpc.useUtils();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<DealStatus | ''>('');
  const [stage, setStage] = useState<DealStage | ''>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<DealWithRelations | null>(null);

  const dealsQuery = trpc.crm.dashboard.deal.list.useQuery({
    search: search.trim() || undefined,
    status: status || undefined,
    stage: stage || undefined,
    limit: 100,
  });

  const summaryQuery = trpc.crm.dashboard.deal.summary.useQuery();

  const deleteDeal = trpc.crm.dashboard.deal.delete.useMutation({
    onSuccess: async () => {
      await utils.crm.dashboard.deal.invalidate();
      toast.success('تم حذف الصفقة');
    },
    onError: error => {
      toast.error(error.message || 'تعذر حذف الصفقة');
    },
  });

  const updateDeal = trpc.crm.dashboard.deal.update.useMutation({
    onSuccess: async () => {
      await utils.crm.dashboard.deal.invalidate();
      toast.success('تم تحديث المرحلة');
    },
    onError: error => {
      toast.error(error.message || 'تعذر تحديث المرحلة');
    },
  });

  const groupedDeals = useMemo(() => {
    const initialValue = Object.fromEntries(
      DEAL_STAGES.map(currentStage => [currentStage, []])
    ) as Record<string, DealWithRelations[]>;

    for (const deal of dealsQuery.data ?? []) {
      initialValue[deal.stage].push(deal);
    }

    return initialValue;
  }, [dealsQuery.data]);

  return (
    <>
      <DashboardContent
        title="الصفقات"
        ctaLabel="صفقة جديدة"
        ctaIcon={<PlusCircle className="h-4 w-4" />}
        onCtaClick={() => {
          setSelectedDeal(null);
          setIsDialogOpen(true);
        }}
        emptyState={{
          text: 'ابدأ ببناء خط المبيعات عبر إنشاء أول صفقة لفريقك.',
          icon: <TrendingUp className="h-16 w-16 text-gray-300" />,
        }}
        dialogs={
          <DealFormDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            deal={selectedDeal}
          />
        }
      >
        {dealsQuery.isPending || summaryQuery.isPending ? (
          <Spinner />
        ) : (
          <div className="space-y-6 px-4 py-5" dir="rtl">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">إجمالي الصفقات</p>
                <p className="mt-3 text-3xl font-semibold">
                  {toArabicNumerals(summaryQuery.data?.total ?? 0)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">قيمة الخط المفتوح</p>
                <p className="mt-3 text-2xl font-semibold">
                  {formatCurrency(String(summaryQuery.data?.pipelineValue ?? 0), 'SAR')}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">الصفقات المغلقة فوز</p>
                <p className="mt-3 flex items-center gap-2 text-3xl font-semibold">
                  <Trophy className="h-5 w-5 text-emerald-600" />
                  {toArabicNumerals(summaryQuery.data?.won ?? 0)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">الصفقات المفتوحة</p>
                <p className="mt-3 flex items-center gap-2 text-3xl font-semibold">
                  <Circle className="h-4 w-4 text-blue-600 fill-blue-600" />
                  {toArabicNumerals(summaryQuery.data?.open ?? 0)}
                </p>
              </div>
            </div>

            <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-3">
              <Input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="ابحث في الصفقات أو العملاء"
              />
              <select
                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                value={stage}
                onChange={event => setStage(event.target.value as DealStage | '')}
              >
                <option value="">كل المراحل</option>
                {DEAL_STAGES.map(currentStage => (
                  <option key={currentStage} value={currentStage}>
                    {stageLabels[currentStage]}
                  </option>
                ))}
              </select>
              <select
                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                value={status}
                onChange={event => setStatus(event.target.value as DealStatus | '')}
              >
                <option value="">كل الحالات</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <div className="grid min-w-[1200px] grid-cols-6 gap-4">
                {DEAL_STAGES.map(currentStage => {
                  const columnDeals = groupedDeals[currentStage] ?? [];
                  const stageValue = columnDeals.reduce(
                    (sum, deal) => sum + Number(deal.amount ?? 0),
                    0
                  );

                  return (
                    <section
                      key={currentStage}
                      className="rounded-2xl border border-gray-200 bg-gray-50/80 p-3"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h2 className="text-sm font-semibold text-gray-900">
                            {stageLabels[currentStage]}
                          </h2>
                          <p className="text-xs text-gray-500">
                            {toArabicNumerals(columnDeals.length)} صفقة
                          </p>
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          <SaudiRiyalAmount amount={stageValue} symbolSize={0.8} />
                        </span>
                      </div>

                      <div className="space-y-3">
                        {columnDeals.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 px-3 py-6 text-center text-sm text-gray-500">
                            لا توجد صفقات
                          </div>
                        ) : (
                          columnDeals.map(deal => (
                            <DealCard
                              key={deal.id}
                              deal={deal}
                              onEdit={currentDeal => {
                                setSelectedDeal(currentDeal);
                                setIsDialogOpen(true);
                              }}
                              onDelete={dealId => deleteDeal.mutate({ id: dealId })}
                              onStageChange={(currentDeal, nextStage) =>
                                updateDeal.mutate({
                                  id: currentDeal.id,
                                  stage: nextStage as DealStage,
                                  status:
                                    nextStage === 'won'
                                      ? 'won'
                                      : nextStage === 'lost'
                                        ? 'lost'
                                        : 'open',
                                })
                              }
                            />
                          ))
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DashboardContent>
    </>
  );
}

export default DealsPage;
