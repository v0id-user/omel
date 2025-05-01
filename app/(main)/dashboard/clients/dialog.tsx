import { DashboardDialog } from '@/components/dashboard/Dialog';
import { UserPlus } from 'iconoir-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ClientsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export function AddClientsDialog({ isOpen, onClose }: ClientsDialogProps) {
  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title="إضافة عميل"
      icon={<UserPlus className="w-4 h-4" />}
    >
      <div className="flex flex-col gap-4 mx-auto max-w-md">
        <Input type="text" placeholder="الاسم" />
        <Input type="text" placeholder="البريد الإلكتروني" />
        <Input type="text" placeholder="رقم الهاتف" />
        <Input type="text" placeholder="العنوان" />
        <Input type="text" placeholder="المدينة" />
        <Input type="text" placeholder="المنطقة" />
        <Input type="text" placeholder="البلد" />
        <Input type="text" placeholder="الرمز البريدي" />
        <Button type="submit">إضافة</Button>
        <h1>TODO: Make the form to add new clients</h1>
      </div>
    </DashboardDialog>
  );
}
