'use client';

import { DashboardContent } from '@/components/dashboard';
import { UserPlus } from 'iconoir-react';
import { useState } from 'react';
import { AddClientsDialog } from './dialog';
import AddGroup from '@/public/icons/iso/add-group.svg';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';
import { motion } from 'framer-motion';

export default function ClientsPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const contacts = [
    {
      id: '1',
      name: 'شركة التقنية الحديثة',
      email: 'info@tech.com',
      phone: '+966501234567',
      city: 'الرياض',
      country: 'السعودية',
    },
    {
      id: '2',
      name: 'مؤسسة الحلول الذكية',
      email: 'contact@smart.com',
      phone: '+966555987654',
      city: 'جدة',
      country: 'السعودية',
    },
    {
      id: '3',
      name: 'نهج الابتكار',
      email: 'support@innovation.com',
      phone: '+971501234567',
      city: 'دبي',
      country: 'الإمارات',
    },
  ];

  const handleSelectAll = () => {
    if (selectedRows.length === contacts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(contacts.map(contact => contact.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleBulkDelete = () => {
    // Implement bulk delete logic
    console.log('Deleting:', selectedRows);
  };

  const handleBulkEdit = () => {
    // Implement bulk edit logic
    console.log('Editing:', selectedRows);
  };

  const formatPhoneNumber = (phone: string) => {
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (!phoneNumber) return <span>{phone}</span>;

    const countryCode = phoneNumber.countryCallingCode;
    const nationalNumber = phoneNumber.nationalNumber;

    // Convert to Arabic numerals
    const toArabicNumbers = (num: string) => {
      return num.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
    };

    return (
      <>
        <span className="flex flex-row-reverse items-end justify-end w-fit text-xs">
          <div className="flex flex-row-reverse items-start justify-start bg-gray-200 text-gray-800 px-0.5 rounded-md">
            <span className="text-sm">+</span>
            <span className="ml-1">{toArabicNumbers(countryCode.toString())}</span>
          </div>
          <span className="mx-1">{toArabicNumbers(nationalNumber.slice(0, 3))}</span>
          <span>{toArabicNumbers(nationalNumber.slice(3))}</span>
        </span>
      </>
    );
  };

  return (
    <DashboardContent
      title="العملاء"
      ctaLabel="عميل جديد"
      ctaIcon={<UserPlus className="w-4 h-4 ml-2" />}
      onCtaClick={() => setDialogOpen(true)}
      sortOptions={[
        { value: 'name', label: 'الاسم' },
        { value: 'email', label: 'البريد الإلكتروني' },
        { value: 'phone', label: 'الهاتف' },
      ]}
      currentSort="name"
      onSortChange={value => {
        console.log('Sort by:', value);
      }}
      emptyState={{
        text: 'لايوجد عملاء بعد! أنشئ عميلك الأول للبدء.',
        icon: <AddGroup className="w-[100px] h-[100px]" />,
      }}
      dialogs={<AddClientsDialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} />}
    >
      <div className="relative">
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-50"
          >
            <span className="text-sm text-gray-600 ml-2">
              تم تحديد {selectedRows.length} {selectedRows.length === 1 ? 'عميل' : 'عملاء'}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
              onClick={handleBulkEdit}
            >
              <Pencil className="w-4 h-4 ml-1" />
              تعديل
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 cursor-pointer"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4 ml-1" />
              حذف
            </Button>
          </motion.div>
        )}

        <Table className="space-y-4">
          <TableHeader>
            <TableRow className="py-4">
              <TableHead className="w-[50px] text-center">
                <Checkbox
                  checked={selectedRows.length === contacts.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-right font-medium text-gray-600 py-4">الاسم</TableHead>
              <TableHead className="text-right font-medium text-gray-600 py-4">
                البريد الإلكتروني
              </TableHead>
              <TableHead className="text-right font-medium text-gray-600 py-4">الهاتف</TableHead>
              <TableHead className="text-right font-medium text-gray-600 py-4">المدينة</TableHead>
              <TableHead className="text-right font-medium text-gray-600 py-4">الدولة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="space-y-2">
            {contacts.map(contact => (
              <TableRow
                key={contact.id}
                data-state={selectedRows.includes(contact.id) ? 'selected' : undefined}
                className="hover:bg-gray-50/80 py-4"
              >
                <TableCell className="text-center py-4">
                  <Checkbox
                    checked={selectedRows.includes(contact.id)}
                    onCheckedChange={() => handleSelectRow(contact.id)}
                  />
                </TableCell>
                <TableCell className="text-right font-medium py-4">{contact.name}</TableCell>
                <TableCell className="text-right text-gray-600 py-4">
                  {contact.email.split('@').map((part, index) => (
                    <span
                      key={index}
                      className={
                        index === 1 ? 'bg-blue-500/10 text-blue-500 rounded-md px-0.5 py-0.5' : ''
                      }
                    >
                      {index === 0 ? part : '@' + part}
                    </span>
                  ))}
                </TableCell>
                <TableCell className="text-right text-gray-600 py-4">
                  {formatPhoneNumber(contact.phone)}
                </TableCell>
                <TableCell className="text-right text-gray-600 py-4">{contact.city}</TableCell>
                <TableCell className="text-right text-gray-600 py-4">{contact.country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardContent>
  );
}
