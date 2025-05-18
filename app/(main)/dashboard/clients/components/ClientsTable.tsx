'use client';

import React, { useState, useEffect } from 'react';
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
import { Trash2, Mail, Phone, MapPin, Globe, Pen, Copy } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useResizableColumns } from '@/hooks/use-resizable-columns';

interface CopyableProps {
  value: string;
  maxWidth?: string;
  onCopied?: () => void;
  children: React.ReactNode;
}

const Copyable: React.FC<CopyableProps> = ({ value, maxWidth = 'none', onCopied, children }) => {
  return (
    <div
      className="ring-1 ring-blue-500/20 hover:bg-blue-500/10 cursor-pointer rounded-md w-fit px-1 py-0.5 group relative overflow-hidden transition-colors duration-400"
      onClick={() => {
        navigator.clipboard.writeText(value);
        onCopied?.();
      }}
    >
      <span className={`text-xs font-semibold text-blue-500 truncate block`} style={{ maxWidth }}>
        {children}
      </span>
      <div className="absolute right-0 top-0 bottom-0 w-5 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-gradient-to-l from-blue-50 via-blue-50/90 to-transparent rounded-r-md
            transition-all duration-300 ease-in-out
            translate-x-[150%] opacity-0 backdrop-blur-[4px]
            group-hover:translate-x-0 group-hover:opacity-100"
        >
          <Copy
            className="w-3.5 h-3.5 text-blue-500 absolute inset-0 m-auto cursor-pointer
              transition-all duration-300 ease-in-out
              translate-x-[150%] opacity-0 
              group-hover:translate-x-0 group-hover:opacity-100"
            onClick={() => {
              navigator.clipboard.writeText(value);
              onCopied?.();
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

interface ClientsTableProps {
  contacts: Contact[];
  //   onEdit?: (ids: string[]) => void;
  onDelete?: (ids: string[]) => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({ contacts, onDelete }) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState({
    name: 20, // percentage
    email: 25,
    phone: 20,
    city: 15,
    country: 15,
  });

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  // Reusable RTL-aware resize handler
  const handleMouseDown = useResizableColumns(isMobile, isTablet, columnWidths, setColumnWidths);

  // Determine resizer placement based on document direction
  const direction: 'rtl' | 'ltr' =
    typeof document !== 'undefined' && document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
  const resizerSideClass = direction === 'rtl' ? 'right-0' : 'left-0';

  // Adjust column visibility based on screen size
  useEffect(() => {
    if (isMobile) {
      setColumnWidths({
        name: 30,
        email: 35,
        phone: 30,
        city: 0, // hidden on mobile
        country: 0, // hidden on mobile
      });
    } else if (isTablet) {
      setColumnWidths({
        name: 25,
        email: 30,
        phone: 25,
        city: 0, // hidden on tablet
        country: 15,
      });
    } else {
      setColumnWidths({
        name: 20,
        email: 25,
        phone: 20,
        city: 15,
        country: 15,
      });
    }
  }, [isMobile, isTablet]);

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
    onDelete?.(selectedRows);
  };

  //   const handleBulkEdit = () => {
  //     onEdit?.(selectedRows);
  //   };

  const formatPhoneNumber = (phone: string) => {
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (!phoneNumber) return <span>{phone}</span>;

    const countryCode = phoneNumber.countryCallingCode;
    const nationalNumber = phoneNumber.nationalNumber;

    // Convert to Arabic numerals
    const toArabicNumbers = (num: string) => {
      return num.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
    };

    const formattedContent = (
      <span className="flex items-center gap-1 text-xs font-semibold">
        <span>{toArabicNumbers(nationalNumber.slice(3))}</span>
        <span>{toArabicNumbers(nationalNumber.slice(0, 3))}</span>
        <span>+{toArabicNumbers(countryCode.toString())}</span>
      </span>
    );

    return (
      <Copyable value={phone} onCopied={() => toast.success('تم نسخ رقم الهاتف')}>
        {formattedContent}
      </Copyable>
    );
  };

  const formatEmail = (email: string, isMobile: boolean, isTablet: boolean) => {
    const maxWidth = isMobile ? '100px' : isTablet ? '120px' : '160px';
    return (
      <Copyable
        value={email}
        maxWidth={maxWidth}
        onCopied={() => toast.success('تم نسخ البريد الإلكتروني')}
      >
        {email}
      </Copyable>
    );
  };

  return (
    <div className="relative overflow-x-auto">
      {selectedRows.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed ${isMobile ? 'bottom-4 left-4 right-4 translate-x-0' : 'bottom-6 left-1/2 -translate-x-1/2'} flex items-center ${isMobile ? 'justify-between' : 'gap-2'} bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-50`}
        >
          <span className={`text-sm text-gray-600 ${isMobile ? 'mr-0' : 'ml-2'}`}>
            تم تحديد{' '}
            {selectedRows.length === 1
              ? 'عميل'
              : selectedRows.length === 2
                ? 'عميلين'
                : `${selectedRows.length} عملاء`}
          </span>
          <div className="flex gap-2">
            {/* <Button
              variant="outline"
              size={isMobile ? 'icon' : 'sm'}
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
              onClick={handleBulkEdit}
            >
              <Pencil className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ml-1`} />
              {!isMobile && 'تعديل'}
            </Button> */}
            <Button
              variant="outline"
              size={isMobile ? 'icon' : 'sm'}
              className="text-red-600 hover:text-red-700 cursor-pointer"
              onClick={handleBulkDelete}
            >
              <Trash2 className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ml-1`} />
              {!isMobile && 'حذف'}
            </Button>
          </div>
        </motion.div>
      )}
      <div className="w-full">
        <Table className="min-w-full border-b">
          <TableHeader>
            <TableRow className="py-2">
              <TableHead className="w-[40px] text-center">
                <Checkbox
                  checked={selectedRows.length === contacts.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead
                className="relative text-right font-medium text-gray-600 py-2 border-l"
                style={{ width: `${columnWidths.name}%` }}
              >
                <div className="flex items-center justify-start gap-1.5">
                  <Pen className="w-3.5 h-3.5" />
                  <span className="text-sm">الاسم</span>
                </div>
                <div
                  className={`absolute top-0 h-full w-1 cursor-col-resize select-none ${resizerSideClass}`}
                  onMouseDown={e => handleMouseDown(e, 'name')}
                />
              </TableHead>
              <TableHead
                className="relative text-right font-medium text-gray-600 py-2 border-l"
                style={{ width: `${columnWidths.email}%` }}
              >
                <div className="flex items-center justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-sm">البريد الإلكتروني</span>
                </div>
                <div
                  className={`absolute top-0 h-full w-1 cursor-col-resize select-none ${resizerSideClass}`}
                  onMouseDown={e => handleMouseDown(e, 'email')}
                />
              </TableHead>
              <TableHead
                className="relative text-right font-medium text-gray-600 py-2 border-l"
                style={{ width: `${columnWidths.phone}%` }}
              >
                <div className="flex items-center justify-start gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-sm">الهاتف</span>
                </div>
                <div
                  className={`absolute top-0 h-full w-1 cursor-col-resize select-none ${resizerSideClass}`}
                  onMouseDown={e => handleMouseDown(e, 'phone')}
                />
              </TableHead>
              {columnWidths.city > 0 && (
                <TableHead
                  className="relative text-right font-medium text-gray-600 py-2 border-l"
                  style={{ width: `${columnWidths.city}%` }}
                >
                  <div className="flex items-center justify-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-sm">المدينة</span>
                  </div>
                  <div
                    className={`absolute top-0 h-full w-1 cursor-col-resize select-none ${resizerSideClass}`}
                    onMouseDown={e => handleMouseDown(e, 'city')}
                  />
                </TableHead>
              )}
              {columnWidths.country > 0 && (
                <TableHead
                  className="relative text-right font-medium text-gray-600 py-2"
                  style={{ width: `${columnWidths.country}%` }}
                >
                  <div className="flex items-center justify-start gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="text-sm">الدولة</span>
                  </div>
                  <div
                    className={`absolute top-0 h-full w-1 cursor-col-resize select-none ${resizerSideClass}`}
                    onMouseDown={e => handleMouseDown(e, 'country')}
                  />
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="space-y-1">
            {contacts.map(contact => (
              <TableRow
                key={contact.id}
                data-state={selectedRows.includes(contact.id) ? 'selected' : undefined}
                className="hover:bg-gray-50/80 py-2"
              >
                <TableCell className="text-center py-2">
                  <Checkbox
                    checked={selectedRows.includes(contact.id)}
                    onCheckedChange={() => handleSelectRow(contact.id)}
                  />
                </TableCell>
                <TableCell
                  className="text-right font-medium py-2 border-l"
                  style={{ width: `${columnWidths.name}%` }}
                >
                  <span className="text-sm">{contact.name}</span>
                </TableCell>
                <TableCell
                  className="text-right py-2 border-l"
                  style={{ width: `${columnWidths.email}%` }}
                >
                  {formatEmail(contact.email, isMobile, isTablet)}
                </TableCell>
                <TableCell
                  className="text-right text-gray-600 py-2 border-l"
                  style={{ width: `${columnWidths.phone}%` }}
                >
                  {formatPhoneNumber(contact.phone)}
                </TableCell>
                {columnWidths.city > 0 && (
                  <TableCell
                    className="text-right text-gray-600 py-2 border-l"
                    style={{ width: `${columnWidths.city}%` }}
                  >
                    {contact.city}
                  </TableCell>
                )}
                {columnWidths.country > 0 && (
                  <TableCell
                    className="text-right text-gray-600 py-2"
                    style={{ width: `${columnWidths.country}%` }}
                  >
                    {contact.country}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
