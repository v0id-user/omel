import { OButton } from '@/components/omel/Button';
import { Sorter } from '@/components/ui/sorter';
import React from 'react';

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
  dialogs?: React.ReactNode;
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
  dialogs,
}: DashboardContentProps) {
  const isEmpty =
    React.Children.count(children) === 0 || children === null || children === undefined;

  return (
    <div className="w-full min-h-[80vh] relative" dir="rtl">
      {(!isEmpty || sortOptions) && (
        <div className="flex justify-between items-center border-y border-gray-200 py-3.5 px-4 mt-5">
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
          <OButton
            onClick={onCtaClick}
            className="flex items-center gap-1 mr-auto text-xs py-1.5 px-2"
            variant="secondary"
          >
            {ctaLabel}
            {ctaIcon}
          </OButton>
        </div>
      )}

      {isEmpty && emptyState ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          {emptyState.icon}
          <h1 className="text-xl font-bold font-gray-500 mb-2">{title}</h1>
          <p className="text-gray-500 mb-4">{emptyState.text}</p>
          <OButton
            onClick={onCtaClick}
            className="flex items-center gap-1 text-xs py-1.5 px-2"
            variant="secondary"
          >
            {ctaLabel}
            {ctaIcon}
          </OButton>
        </div>
      ) : (
        children
      )}

      {dialogs}
    </div>
  );
}
