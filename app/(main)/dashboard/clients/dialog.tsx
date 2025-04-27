import { DashboardDialog } from '@/components/dashboard/Dialog';
import { UserPlus } from 'iconoir-react';
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
      <div>
        <h1>TODO: Make the form to add new clients</h1>
      </div>
    </DashboardDialog>
  );
}
