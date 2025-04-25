'use client';
import { useEffect, useState } from 'react';
import { Xmark, Minus, MultiWindow, WebWindow } from 'iconoir-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardDialogProps {
  isOpen: boolean;
  title: string;
  onClose?: () => void;
  children?: React.ReactNode;
  minimizable?: boolean;
  icon?: React.ReactNode;
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
  children: React.ReactNode;
  togglePin: () => void;
  handleClose: () => void;
  icon?: React.ReactNode;
}

function PinnedCircularView({
  position,
  setPosition,
  isExpanded,
  setIsExpanded,
  title,
  children,
  togglePin,
  handleClose,
  icon,
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
              <Xmark className="w-3 h-3 cursor-pointer" onClick={() => setIsExpanded(false)} />
            </div>
            <div className="text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex flex-col gap-1 items-end">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-1 mb-1"
        >
          <button
            onClick={togglePin}
            className="bg-white text-gray-600 w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
            title="إلغاء التثبيت"
          >
            <WebWindow className="w-3 h-3" />
          </button>
          <button
            onClick={handleClose}
            className="bg-white text-gray-600 w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
            title="إغلاق"
          >
            <Xmark className="w-3 h-3" />
          </button>
        </motion.div>

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
  children: React.ReactNode;
  handleClose: () => void;
  minimizable: boolean;
  setIsMinimized: (minimized: boolean) => void;
  togglePin: () => void;
}

function FullDialog({
  isOpen,
  title,
  children,
  handleClose,
  minimizable,
  setIsMinimized,
  togglePin,
}: FullDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center z-[60] p-4"
          dir="rtl"
          onClick={e => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl border border-gray-100 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="font-semibold text-lg">{title}</h2>
              <div className="flex items-center gap-2">
                {minimizable && (
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-sm p-0.5 animate-all duration-300 cursor-pointer"
                    title="تصغير"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={togglePin}
                  className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-sm p-0.5 animate-all duration-300 cursor-pointer"
                  title="تثبيت"
                >
                  <MultiWindow className="w-3 h-3" />
                </button>
                <button
                  onClick={handleClose}
                  className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-sm p-0.5 animate-all duration-300 cursor-pointer"
                  title="إغلاق"
                >
                  <Xmark className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-4 flex-1">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main DashboardDialog Component
export function DashboardDialog({
  isOpen,
  title,
  onClose,
  children,
  minimizable = false,
  icon,
}: DashboardDialogProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({
    x: 20,
    y: window?.innerHeight ? window.innerHeight - 200 : 400,
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
      setIsMinimized={setIsMinimized}
      togglePin={togglePin}
    >
      {children}
    </FullDialog>
  );
}
