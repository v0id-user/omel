'use client';
import { useEffect, useState } from 'react';
import { OButton } from '@/components/omel/Button';
import { Xmark, Minus } from 'iconoir-react';

interface DashboardDialogProps {
  isOpen: boolean;
  title: string;
  onClose?: () => void;
  children?: React.ReactNode;
  minimizable?: boolean;
}

export function DashboardDialog({
  isOpen,
  title,
  onClose,
  children,
  minimizable = false,
}: DashboardDialogProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Close handler with confirmation prompt fallback
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (confirm('هل أنت متأكد من الإغلاق؟')) {
      // default confirmation
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Minimized bar
  if (isMinimized) {
    return (
      <div
        className="fixed bottom-4 left-4 bg-white shadow-lg rounded-md px-4 py-2 cursor-pointer flex items-center gap-2 z-[60]"
        dir="rtl"
        onClick={() => setIsMinimized(false)}
      >
        <span className="font-medium text-sm truncate max-w-[150px]">{title}</span>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-[60] p-4"
      dir="rtl"
    >
      {/* Dialog Container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="font-semibold text-lg">{title}</h2>
          <div className="flex items-center gap-2">
            {minimizable && (
              <OButton
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(true)}
                className="text-gray-600 hover:text-black"
              >
                <Minus className="w-4 h-4" />
              </OButton>
            )}
            <OButton
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-600 hover:text-black"
            >
              <Xmark className="w-4 h-4" />
            </OButton>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 flex-1">{children}</div>
      </div>
    </div>
  );
}
