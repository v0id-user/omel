'use client';

import React from 'react';
import { ChevronRight, ChevronLeft, MoreHorizontal } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { toArabicNumerals } from '@/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  isLoading?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  isLoading = false,
  className,
}) => {
  if (totalPages <= 1) return null;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    // Adjust if we're near the beginning
    if (currentPage <= half) {
      end = Math.min(totalPages, maxVisiblePages);
    }

    // Adjust if we're near the end
    if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('ellipsis');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn('flex items-center justify-center gap-2 py-4', className)}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="gap-1 h-9 px-3"
      >
        <ChevronRight className="w-4 h-4" />
        <span className="hidden sm:inline">السابق</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-9 h-9 text-gray-400"
              >
                <MoreHorizontal className="w-4 h-4" />
              </div>
            );
          }

          const isCurrentPage = page === currentPage;

          return (
            <Button
              key={page}
              variant={isCurrentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={cn(
                'w-9 h-9 p-0 font-medium transition-colors',
                isCurrentPage
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                  : 'hover:bg-gray-50 text-gray-700 border-gray-200'
              )}
            >
              {toArabicNumerals(page.toString())}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="gap-1 h-9 px-3"
      >
        <span className="hidden sm:inline">التالي</span>
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Page Info */}
      <div className="hidden md:flex items-center gap-2 mr-4 text-sm text-gray-600">
        <span>صفحة</span>
        <span className="font-medium text-gray-900">
          {toArabicNumerals(currentPage.toString())}
        </span>
        <span>من</span>
        <span className="font-medium text-gray-900">{toArabicNumerals(totalPages.toString())}</span>
      </div>
    </div>
  );
};

export default Pagination;
