'use client';
import { useEffect, useState } from 'react';
import { Xmark, Minus, MultiWindow, WebWindow } from 'iconoir-react';
import { motion, AnimatePresence } from 'motion/react';

// Shared Button Components
interface DialogButtonProps {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
}

function DialogButton({ onClick, title, icon }: DialogButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-sm p-1 animate-all duration-300 cursor-pointer"
      title={title}
    >
      {icon}
    </button>
  );
}

function CircularButton({ onClick, title, icon }: DialogButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white text-gray-600 w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
      title={title}
    >
      {icon}
    </button>
  );
}

// Shared Button Groups
interface DialogHeaderButtonsProps {
  minimizable?: boolean;
  pinnable?: boolean;
  onMinimize: () => void;
  onPin: () => void;
  onClose: () => void;
}

function DialogHeaderButtons({
  minimizable,
  pinnable,
  onMinimize,
  onPin,
  onClose,
}: DialogHeaderButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {minimizable && (
        <DialogButton onClick={onMinimize} title="تصغير" icon={<Minus className="w-3 h-3" />} />
      )}
      {pinnable && (
        <DialogButton onClick={onPin} title="تثبيت" icon={<MultiWindow className="w-3 h-3" />} />
      )}
      <DialogButton onClick={onClose} title="إغلاق" icon={<Xmark className="w-3 h-3" />} />
    </div>
  );
}

function CircularActionButtons({ onPin, onClose }: { onPin: () => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-1 mb-1"
    >
      <CircularButton
        onClick={onPin}
        title="إلغاء التثبيت"
        icon={<WebWindow className="w-3 h-3" />}
      />
      <CircularButton onClick={onClose} title="إغلاق" icon={<Xmark className="w-3 h-3" />} />
    </motion.div>
  );
}

// Helper function to get initials or icon
const getInitialOrIcon = (icon: React.ReactNode | undefined, title: string) => {
  if (icon) return icon;
  if (title && title.length > 0) {
    return title.trim().charAt(0).toUpperCase();
  }
  return 'O';
};

// Pinned Circular View Component
interface PinnedCircularViewProps {
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  title: string;
  togglePin: () => void;
  handleClose: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function PinnedCircularView({
  position,
  setPosition,
  isExpanded,
  setIsExpanded,
  title,
  togglePin,
  handleClose,
  icon,
  children,
}: PinnedCircularViewProps) {
  const getExpandedPosition = () => {
    let positionClasses = 'right-full bottom-0 mb-0 mr-2';
    if (position.x < 300) {
      positionClasses = 'left-full bottom-0 mb-0 ml-2';
    }
    if (position.y < 200) {
      positionClasses =
        position.x < 300 ? 'left-full top-0 mt-0 ml-2' : 'right-full top-0 mt-0 mr-2';
    }
    return positionClasses;
  };

  return (
    <div className="fixed z-[70]" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute ${getExpandedPosition()} bg-white rounded-lg shadow-lg p-3 w-[300px] max-h-[400px] overflow-auto`}
            dir="rtl"
          >
            <div className="flex justify-between items-center mb-2 border-b pb-2">
              <h3 className="font-medium text-sm">{title}</h3>
              <DialogButton
                onClick={() => setIsExpanded(false)}
                title="إغلاق"
                icon={<Minus className="w-3 h-3" />}
              />
            </div>
            <div className="text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex flex-col gap-1 items-end">
        <CircularActionButtons onPin={togglePin} onClose={handleClose} />

        <motion.div
          drag
          dragMomentum={false}
          onDragEnd={(e, info) => {
            setPosition({
              x: position.x + info.offset.x,
              y: position.y + info.offset.y,
            });
          }}
          whileTap={{ scale: 1.1 }}
          className="flex justify-center items-center w-12 h-12 rounded-full bg-primary text-white cursor-pointer shadow-lg mt-16"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="text-center font-semibold">{getInitialOrIcon(icon, title)}</div>
        </motion.div>
      </div>
    </div>
  );
}

// Minimized Bar Component
interface MinimizedBarProps {
  title: string;
  setIsMinimized: (minimized: boolean) => void;
}

function MinimizedBar({ title, setIsMinimized }: MinimizedBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 left-4 bg-white shadow-lg rounded-md px-4 py-2 cursor-pointer flex items-center gap-2 z-[60]"
      dir="rtl"
      onClick={() => setIsMinimized(false)}
    >
      <span className="font-medium text-sm truncate max-w-[150px]">{title}</span>
    </motion.div>
  );
}

// Full Dialog Component
interface FullDialogProps {
  isOpen: boolean;
  title: string;
  handleClose: () => void;
  minimizable: boolean;
  pinnable: boolean;
  setIsMinimized: (minimized: boolean) => void;
  togglePin: () => void;
  children: React.ReactNode;
}
function FullDialog({
  isOpen,
  title,
  pinnable,
  handleClose,
  minimizable,
  setIsMinimized,
  togglePin,
  children,
}: FullDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 flex items-start justify-center z-[60] p-4 mt-24"
          dir="rtl"
          onClick={e => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.08 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden p-1"
          >
            <div className="bg-[F0F1F1] flex items-center justify-between rounded-t-xl border border-gray-200 pt-3 pb-2 px-4">
              <h2 className="font-medium text-sm">{title}</h2>
              <DialogHeaderButtons
                minimizable={minimizable}
                pinnable={pinnable}
                onMinimize={() => setIsMinimized(true)}
                onPin={togglePin}
                onClose={handleClose}
              />
            </div>
            <div className="overflow-y-auto flex-1 border-x border-b border-gray-200 rounded-b-xl">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main DashboardDialog Component
interface DashboardDialogProps {
  isOpen: boolean;
  title: string;
  onClose?: () => void;
  children?: React.ReactNode;
  minimizable?: boolean;
  pinnable?: boolean;
  icon?: React.ReactNode;
}

export function DashboardDialog({
  isOpen,
  title,
  onClose,
  children,
  minimizable = false,
  pinnable = false,
  icon,
}: DashboardDialogProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({
    x: 20,
    y: typeof window !== 'undefined' && window?.innerHeight ? window.innerHeight - 200 : 400,
  });

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
      setIsPinned(false);
      setIsExpanded(false);
    }
  }, [isOpen]);

  const togglePin = () => {
    if (!isPinned) {
      setIsPinned(true);
      setIsMinimized(true);
      setIsExpanded(true);
    } else {
      setIsPinned(false);
      setIsMinimized(false);
      setIsExpanded(false);
    }
  };

  if (isPinned && isMinimized) {
    return (
      <PinnedCircularView
        position={position}
        setPosition={setPosition}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        title={title}
        togglePin={togglePin}
        handleClose={handleClose}
        icon={icon}
      >
        {children}
      </PinnedCircularView>
    );
  }

  if (isMinimized && !isPinned) {
    return <MinimizedBar title={title} setIsMinimized={setIsMinimized} />;
  }

  return (
    <FullDialog
      isOpen={isOpen}
      title={title}
      handleClose={handleClose}
      minimizable={minimizable}
      pinnable={pinnable}
      setIsMinimized={setIsMinimized}
      togglePin={togglePin}
    >
      {children}
    </FullDialog>
  );
}
