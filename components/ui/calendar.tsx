'use client';

import * as React from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/ar';
import { cn } from '@/lib/utils';

// Initialize dayjs plugins
dayjs.extend(localeData);
dayjs.extend(updateLocale);

// Set Arabic as the only locale
dayjs.locale('ar');

// Configure Arabic locale
dayjs.updateLocale('ar', {
  months: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  weekdays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  weekdaysShort: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
  weekdaysMin: ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'],
});

// Format a date in Arabic
export function formatGregorianDateArabic(date: Date): string {
  return dayjs(date).format('D MMMM YYYY');
}

// Keep for backward compatibility
export function formatHijriDate(date: Date): string {
  return formatGregorianDateArabic(date);
}

// Generate calendar days using dayjs
function getCalendarDays(year: number, month: number) {
  const firstDayOfMonth = dayjs(new Date(year, month, 1));
  const daysInMonth = firstDayOfMonth.daysInMonth();
  const dayOfWeek = firstDayOfMonth.day(); // 0 = Sunday, 6 = Saturday

  const days: {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
  }[] = [];

  // Add previous month's days
  const previousMonth = dayjs(firstDayOfMonth).subtract(1, 'month');
  const daysInPreviousMonth = previousMonth.daysInMonth();

  for (let i = dayOfWeek - 1; i >= 0; i--) {
    const day = daysInPreviousMonth - i;
    const date = dayjs(previousMonth).date(day).toDate();
    days.push({
      date,
      day,
      isCurrentMonth: false,
    });
  }

  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = dayjs(firstDayOfMonth).date(day).toDate();
    days.push({
      date,
      day,
      isCurrentMonth: true,
    });
  }

  // Add next month's days to complete the grid (6 rows x 7 days = 42 cells)
  const nextMonth = dayjs(firstDayOfMonth).add(1, 'month');
  const remainingDays = 42 - days.length;

  for (let day = 1; day <= remainingDays; day++) {
    const date = dayjs(nextMonth).date(day).toDate();
    days.push({
      date,
      day,
      isCurrentMonth: false,
    });
  }

  return days;
}

// Check if two dates are the same day
function isSameDay(date1: Date, date2: Date) {
  return dayjs(date1).isSame(dayjs(date2), 'day');
}

// Check if a date is between two dates
function isDateInRange(date: Date, startDate: Date, endDate: Date) {
  return (
    (dayjs(date).isAfter(dayjs(startDate), 'day') && dayjs(date).isBefore(dayjs(endDate), 'day')) ||
    isSameDay(date, startDate) ||
    isSameDay(date, endDate)
  );
}

// Types
export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  mode?: 'single' | 'range';
  selected?: Date | Date[] | null;
  onSelect?: (date: Date | Date[] | null) => void;
  disabled?: (date: Date) => boolean;
}

export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  className,
  disabled,
  ...props
}: CalendarProps) {
  const today = new Date();

  // Calendar state
  const [calendarDate, setCalendarDate] = React.useState(dayjs(today));
  const currentMonth = calendarDate.month();
  const currentYear = calendarDate.year();

  // Shared state
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);

  // Initialize selection
  const selectedDates = React.useMemo(() => {
    if (!selected) return { start: null, end: null };
    if (Array.isArray(selected) && selected.length === 2) {
      return { start: selected[0], end: selected[1] };
    }
    if (Array.isArray(selected) && selected.length === 1) {
      return { start: selected[0], end: null };
    }
    if (!Array.isArray(selected)) {
      return { start: selected, end: null };
    }
    return { start: null, end: null };
  }, [selected]);

  // Handle day selection
  const handleSelectDate = (date: Date) => {
    if (mode === 'single') {
      onSelect?.(date);
      return;
    }

    // Range selection logic
    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Start new selection
      onSelect?.([date, null] as Date[]);
    } else {
      // Complete selection
      const isBeforeStart = dayjs(date).isBefore(dayjs(selectedDates.start), 'day');
      const start = isBeforeStart ? date : selectedDates.start;
      const end = isBeforeStart ? selectedDates.start : date;
      onSelect?.([start, end] as Date[]);
    }
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    setCalendarDate(calendarDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCalendarDate(calendarDate.add(1, 'month'));
  };

  // Navigate to today
  const handleGoToToday = () => {
    setCalendarDate(dayjs(today));
  };

  // Get calendar grid
  const days = getCalendarDays(currentYear, currentMonth);

  // Get localized weekdays
  const weekdaysMin = dayjs.weekdaysMin();

  // Get month name
  const monthName = calendarDate.format('MMMM');

  return (
    <div className={cn('p-3 select-none', className)} dir="rtl" {...props}>
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-medium">{`${monthName} ${currentYear}`}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePreviousMonth}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="الشهر السابق"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleGoToToday}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="اليوم"
          >
            <CalendarIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="الشهر التالي"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekdaysMin.map(day => (
          <div key={day} className="text-xs text-muted-foreground text-center py-1.5">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected = selectedDates.start && isSameDay(day.date, selectedDates.start);
          const isRangeEnd = selectedDates.end && isSameDay(day.date, selectedDates.end);
          const isWithinRange =
            selectedDates.start &&
            selectedDates.end &&
            isDateInRange(day.date, selectedDates.start, selectedDates.end);
          const isHovered =
            mode === 'range' &&
            hoveredDate &&
            selectedDates.start &&
            !selectedDates.end &&
            (dayjs(hoveredDate).isAfter(dayjs(selectedDates.start), 'day')
              ? isDateInRange(day.date, selectedDates.start, hoveredDate)
              : isDateInRange(day.date, hoveredDate, selectedDates.start));
          const isToday = isSameDay(day.date, today);
          const isDisabled = disabled && disabled(day.date);

          // The content of the cell
          const cellContent = (
            <div className="h-9 w-9 flex items-center justify-center relative">
              <button
                type="button"
                onClick={() => !isDisabled && handleSelectDate(day.date)}
                onMouseEnter={() => mode === 'range' && setHoveredDate(day.date)}
                onMouseLeave={() => mode === 'range' && setHoveredDate(null)}
                disabled={isDisabled}
                className={cn(
                  'h-full w-full flex items-center justify-center rounded-md',
                  !day.isCurrentMonth && 'text-muted-foreground opacity-50',
                  isDisabled && 'text-muted-foreground opacity-50 cursor-not-allowed',
                  (isSelected || isRangeEnd) &&
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                  isWithinRange && 'bg-accent text-accent-foreground',
                  isHovered && 'bg-accent text-accent-foreground'
                )}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm">{day.day}</span>
                </div>
              </button>

              {/* Today indicator dot */}
              {isToday && (
                <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2"></div>
              )}
            </div>
          );

          // Return normal date cell
          return <div key={index}>{cellContent}</div>;
        })}
      </div>

      {/* Calendar type indicator */}
      <div className="mt-2 text-xs text-center text-muted-foreground">التقويم الميلادي</div>
    </div>
  );
}
