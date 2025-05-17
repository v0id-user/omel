import { useCallback } from 'react';

/**
 * Generic column-resize hook that respects RTL/LTR direction.
 *
 * Usage:
 * const handleMouseDown = useResizableColumns(isMobile, isTablet, columnWidths, setColumnWidths);
 */
export function useResizableColumns<Columns extends Record<string, number>>(
  isMobile: boolean,
  isTablet: boolean,
  columnWidths: Columns,
  setColumnWidths: React.Dispatch<React.SetStateAction<Columns>>
) {
  const direction: 'rtl' | 'ltr' =
    typeof document !== 'undefined' && document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';

  /**
   * Mousedown handler placed on each column resizer.
   * Keeps internal implementation abstracted away from the consuming component.
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, columnKey: keyof Columns, minPercent = 10, maxPercent = 50) => {
      if (isMobile || (isTablet && columnKey === ('city' as keyof Columns))) return;

      e.preventDefault();

      const tableWidth = e.currentTarget.closest('table')?.offsetWidth || 1000;
      const startX = e.clientX;
      const startWidthPercent = columnWidths[columnKey];

      const directionSign = direction === 'rtl' ? -1 : 1;

      const onMouseMove = (event: MouseEvent) => {
        const deltaX = (event.clientX - startX) * directionSign; // respect RTL
        const deltaPercent = (deltaX / tableWidth) * 100;
        const newWidth = Math.max(startWidthPercent + deltaPercent, minPercent);

        if (newWidth > maxPercent) return;
        setColumnWidths(prev => ({ ...prev, [columnKey]: newWidth }));
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [columnWidths, direction, isMobile, isTablet, setColumnWidths]
  );

  return handleMouseDown;
}
