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
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
          <div className="fixed bottom-6 left-6 flex items-center gap-2 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-50">
            <span className="text-sm text-gray-600 ml-2">
              تم تحديد {selectedRows.length} {selectedRows.length === 1 ? 'عميل' : 'عملاء'}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 hover:text-gray-900"
              onClick={handleBulkEdit}
            >
              <Pencil className="w-4 h-4 ml-1" />
              تعديل
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4 ml-1" />
              حذف
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <Checkbox
                  checked={selectedRows.length === contacts.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-right font-medium text-gray-600">الاسم</TableHead>
              <TableHead className="text-right font-medium text-gray-600">
                البريد الإلكتروني
              </TableHead>
              <TableHead className="text-right font-medium text-gray-600">الهاتف</TableHead>
              <TableHead className="text-right font-medium text-gray-600">المدينة</TableHead>
              <TableHead className="text-right font-medium text-gray-600">الدولة</TableHead>
              <TableHead className="text-center font-medium text-gray-600">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map(contact => (
              <TableRow
                key={contact.id}
                data-state={selectedRows.includes(contact.id) ? 'selected' : undefined}
                className="hover:bg-gray-50/80"
              >
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedRows.includes(contact.id)}
                    onCheckedChange={() => handleSelectRow(contact.id)}
                  />
                </TableCell>
                <TableCell className="text-right font-medium">{contact.name}</TableCell>
                <TableCell className="text-right text-gray-600">{contact.email}</TableCell>
                <TableCell className="text-right text-gray-600">{contact.phone}</TableCell>
                <TableCell className="text-right text-gray-600">{contact.city}</TableCell>
                <TableCell className="text-right text-gray-600">{contact.country}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex h-8 w-8 p-0 data-[state=open]:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">فتح القائمة</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem className="text-right">
                          <Eye className="ml-2 h-4 w-4" />
                          <span>عرض</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-right">
                          <Pencil className="ml-2 h-4 w-4" />
                          <span>تعديل</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-right text-red-600">
                          <Trash2 className="ml-2 h-4 w-4" />
                          <span>حذف</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardContent>
  );
}
