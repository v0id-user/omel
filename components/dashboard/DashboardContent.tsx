import { OButton } from '@/components/omel/Button';
import Image from 'next/image';
import { Sorter } from '@/components/ui/sorter';

interface DashboardContentProps {
  children: React.ReactNode;
  title: string;
  ctaLabel: string;
  ctaIcon?: React.ReactNode;
  onCtaClick: () => void;
  sortOptions?: {
    value: string;
    label: string;
  }[];
  onSortChange?: (value: string) => void;
  currentSort?: string;
  emptyState?: {
    text: string;
    icon?: React.ReactNode;
  };
}

export function DashboardContent({
  children,
  title,
  ctaLabel,
  ctaIcon,
  onCtaClick,
  sortOptions,
  onSortChange,
  currentSort,
  emptyState,
}: DashboardContentProps) {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <div className="w-full min-h-[80vh] relative" dir="rtl">
      <div className="flex justify-between items-center border-y border-gray-200 py-4 mt-5">
        {sortOptions && (
          <div className="flex items-center">
            <Sorter
              value={currentSort}
              onValueChange={onSortChange}
              options={sortOptions}
              className="w-[200px]"
            />
          </div>
        )}
        <OButton onClick={onCtaClick} className="mr-auto text-xs py-1.5 px-2" variant="secondary">
          {ctaIcon}
          {ctaLabel}
        </OButton>
      </div>

      {isEmpty && emptyState ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Image
            src="/icons/iso/add-circle.svg"
            alt="Empty state"
            className="mb-4 opacity-50"
            width={100}
            height={100}
          />
          <h1 className="text-xl font-bold font-gray-500 mb-2">{title}</h1>
          <p className="text-gray-500 mb-4">{emptyState.text}</p>
          <OButton onClick={onCtaClick} className="text-xs py-1.5 px-2" variant="secondary">
            {ctaIcon}
            {ctaLabel}
          </OButton>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
