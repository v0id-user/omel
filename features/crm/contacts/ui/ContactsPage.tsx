'use client';

import { DashboardContent } from '@/components/dashboard';
import { Input } from '@/components/ui/input';
import { ContactRecord } from '@/features/crm/contacts/types';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { AddClientsDialog } from '@/app/(main)/dashboard/clients/dialog';
import { EditContactsDialog } from '@/app/(main)/dashboard/clients/EditContactsDialog';
import AddGroup from '@/public/icons/iso/add-group.svg';
import { ClientsTable } from '@/app/(main)/dashboard/clients/components';
import { trpc } from '@/trpc/client';
import { Spinner } from '@/components/omel/Spinner';
import { toast } from 'react-hot-toast';
import { Pagination } from '@/components/ui/pagination';
import { log } from '@/utils/logs';

export default function ContactsPage() {
  const router = useRouter();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [contactType, setContactType] = useState('');
  const [contactStatus, setContactStatus] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt'>('name');
  const pageLimit = 10;
  const utils = trpc.useUtils();

  const {
    data: paginatedClients,
    error: clientsError,
    isPending,
  } = trpc.crm.dashboard.contact.getByPage.useQuery(
    {
      page: currentPage,
      limit: pageLimit,
    },
    {
      retry: (failureCount, error) => {
        return error?.data?.code !== 'NOT_FOUND' && failureCount < 3;
      },
    }
  );

  const searchContactsQuery = trpc.crm.dashboard.contact.search.useQuery(
    {
      searchTerm: searchTerm.trim(),
      page: 1,
      limit: 100,
    },
    {
      enabled: searchTerm.trim().length > 0,
      retry: (failureCount, error) => {
        return error?.data?.code !== 'NOT_FOUND' && failureCount < 3;
      },
    }
  );

  const clients = useMemo(() => {
    const rawContacts =
      searchTerm.trim().length > 0
        ? (searchContactsQuery.data?.data ?? [])
        : (paginatedClients?.data ?? []);

    const filteredContacts = rawContacts.filter(contact => {
      if (contactType && contact.contactType !== contactType) {
        return false;
      }

      if (contactStatus && contact.status !== contactStatus) {
        return false;
      }

      return true;
    });

    return [...filteredContacts].sort((left, right) => {
      if (sortBy === 'createdAt') {
        return new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime();
      }

      const leftValue = String(left[sortBy] ?? '').toLowerCase();
      const rightValue = String(right[sortBy] ?? '').toLowerCase();
      return leftValue.localeCompare(rightValue, 'ar');
    });
  }, [
    contactStatus,
    contactType,
    paginatedClients?.data,
    searchContactsQuery.data?.data,
    searchTerm,
    sortBy,
  ]);

  const deleteContactsRpc = trpc.crm.dashboard.contact.deleteMany.useMutation({
    onSuccess: () => {
      toast.success('تم حذف العملاء بنجاح');
      utils.crm.dashboard.contact.invalidate();
    },
    onError: error => {
      toast.error(error.message || 'حدث خطأ أثناء حذف العملاء');
    },
  });

  useEffect(() => {
    if (clientsError && clientsError.data?.code !== 'NOT_FOUND') {
      toast.error(clientsError.message);
    }
  }, [clientsError]);

  const handleEdit = (ids: string[]) => {
    console.log(
      log({
        component: 'ClientsPage',
        message: 'handleEdit called with ids:' + ids,
      })
    );
    setSelectedContactIds(ids);
    setEditDialogOpen(true);
    console.log(
      log({
        component: 'ClientsPage',
        message: 'Edit dialog should be open now',
      })
    );
  };

  const handleDelete = (ids: string[]) => {
    if (ids.length === 0) {
      return;
    }

    deleteContactsRpc.mutate({
      ids,
    });
  };

  const handleView = (contact: ContactRecord) => {
    router.push(`/dashboard/clients/${contact.id}`);
  };

  const isSearching = searchTerm.trim().length > 0;
  const isLoading = isSearching ? searchContactsQuery.isPending : isPending;

  return (
    <DashboardContent
      title="العملاء"
      ctaLabel="عميل جديد"
      ctaIcon={<UserPlus className="w-4 h-4 ml-2" />}
      onCtaClick={() => setDialogOpen(true)}
      emptyState={{
        text: 'لايوجد عملاء بعد! أنشئ عميلك الأول للبدء.',
        icon: <AddGroup className="w-[100px] h-[100px]" />,
      }}
      dialogs={
        <>
          {isDialogOpen && (
            <AddClientsDialog
              isOpen={isDialogOpen}
              onClose={() => {
                setDialogOpen(false);
              }}
            />
          )}
          {isEditDialogOpen && (
            <EditContactsDialog
              isOpen={isEditDialogOpen}
              onClose={() => {
                setEditDialogOpen(false);
                setSelectedContactIds([]);
              }}
              contactIds={selectedContactIds}
            />
          )}
        </>
      }
    >
      {isLoading ? (
        <Spinner />
      ) : clientsError?.data?.code === 'NOT_FOUND' ? null : clients.length > 0 ? (
        <div className="space-y-4 px-4 py-5" dir="rtl">
          <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-4">
            <Input
              value={searchTerm}
              onChange={event => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="ابحث بالاسم أو البريد أو الهاتف"
            />
            <select
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={contactType}
              onChange={event => setContactType(event.target.value)}
            >
              <option value="">كل الأنواع</option>
              <option value="person">أفراد</option>
              <option value="company">شركات</option>
            </select>
            <select
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={contactStatus}
              onChange={event => setContactStatus(event.target.value)}
            >
              <option value="">كل الحالات</option>
              <option value="lead">مهتم</option>
              <option value="prospect">فرصة</option>
              <option value="customer">عميل</option>
              <option value="inactive">غير نشط</option>
            </select>
            <select
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={sortBy}
              onChange={event => setSortBy(event.target.value as 'name' | 'email' | 'createdAt')}
            >
              <option value="name">ترتيب حسب الاسم</option>
              <option value="email">ترتيب حسب البريد</option>
              <option value="createdAt">الأحدث إضافة</option>
            </select>
          </div>

          <ClientsTable
            data={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
          {!isSearching && paginatedClients && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginatedClients.totalPages}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
            />
          )}
        </div>
      ) : null}
    </DashboardContent>
  );
}
