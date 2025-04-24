'use client';

import * as React from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
// Custom implementation for Hijri date conversions since we're building from scratch
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Hijri month names in Arabic
const HIJRI_MONTHS = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

// Month indices for special date checking
const SHABAN_INDEX = 7;
const RAMADAN_INDEX = 8;
const SHAWWAL_INDEX = 9;
const DHU_AL_QADAH_INDEX = 10;
const DHU_AL_HIJJAH_INDEX = 11;

// Weekday names in Arabic, starting with Sunday
const WEEKDAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

// Implementation of Hijri calendar conversion algorithms (Tabular Islamic calendar)
// Reference: "Calendrical Calculations" by Nachum Dershowitz and Edward M. Reingold

// Constants for Islamic calendar calculations
const ISLAMIC_EPOCH = 1948439.5; // Julian day number for 1 Muharram 1 A.H.

// Convert Gregorian date to Julian day number
function gregorianToJulianDay(year: number, month: number, day: number): number {
  // Adjust month and year for January and February
  if (month < 3) {
    month += 12;
    year -= 1;
  }

  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);

  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

// Convert Julian day to Hijri date
function julianDayToIslamic(jd: number): { year: number; month: number; day: number } {
  const jd1 = Math.floor(jd) + 0.5;
  const year = Math.floor((30 * (jd1 - ISLAMIC_EPOCH) + 10646) / 10631);
  const month = Math.min(12, Math.ceil((jd1 - (29 + islamicToJulianDay(year, 1, 1))) / 29.5) + 1);
  const day = Math.floor(jd1 - islamicToJulianDay(year, month, 1) + 1);

  // Adjust month to be 0-indexed for our internal calculations
  return { year, month: month - 1, day };
}

// Convert Hijri date to Julian day number
function islamicToJulianDay(year: number, month: number, day: number): number {
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    ISLAMIC_EPOCH -
    1
  );
}

// Convert Julian day to Gregorian date
function julianDayToGregorian(jd: number): { year: number; month: number; day: number } {
  const z = Math.floor(jd + 0.5);
  const a = Math.floor((z - 1867216.25) / 36524.25);
  const b = z + 1 + a - Math.floor(a / 4);
  const c = b + 1524;
  const d = Math.floor((c - 122.1) / 365.25);
  const e = Math.floor(365.25 * d);
  const f = Math.floor((c - e) / 30.6001);

  const day = Math.floor(c - e - Math.floor(30.6001 * f));
  const month = f - 1 - 12 * Math.floor(f / 14);
  const year = d - 4715 - Math.floor((7 + month) / 10);

  return { year, month, day };
}

// Get Hijri date from Gregorian date
function getHijriDate(date: Date): { year: number; month: number; day: number } {
  const jd = gregorianToJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return julianDayToIslamic(jd);
}

// Get Gregorian date from Hijri date parts
function getGregorianFromHijri(year: number, month: number, day: number): Date {
  // Adjust month to be 1-indexed for the conversion
  const jd = islamicToJulianDay(year, month + 1, day);
  const { year: gYear, month: gMonth, day: gDay } = julianDayToGregorian(jd);
  return new Date(gYear, gMonth - 1, gDay);
}

// Format a Hijri date
export function formatHijriDate(date: Date): string {
  const hijri = getHijriDate(date);
  return `${hijri.day} ${HIJRI_MONTHS[hijri.month]} ${hijri.year}`;
}

// Calculate days in Hijri month
function getDaysInHijriMonth(year: number, month: number): number {
  // In the Islamic calendar, odd months have 30 days and even months have 29 days
  // with adjustments for leap years
  if ((month + 1) % 2 === 1) {
    return 30;
  } else if (month + 1 === 12) {
    // For Dhu al-Hijjah, check if it's a leap year (11 leap years in a 30-year cycle)
    const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
    const cycleYear = year % 30;
    return leapYears.includes(cycleYear) ? 30 : 29;
  } else {
    return 29;
  }
}

// Check if a Hijri date is a potentially uncertain date (requires moon sighting)
function isUncertainDate(day: number, month: number): boolean {
  // 29th of specified months
  if (
    day === 29 &&
    [SHABAN_INDEX, RAMADAN_INDEX, SHAWWAL_INDEX, DHU_AL_QADAH_INDEX, DHU_AL_HIJJAH_INDEX].includes(
      month
    )
  ) {
    return true;
  }

  // 1st of specified months
  if (day === 1 && [RAMADAN_INDEX, SHAWWAL_INDEX, DHU_AL_HIJJAH_INDEX].includes(month)) {
    return true;
  }

  return false;
}

// Create a HijriDate type that stores both the Gregorian Date (for selection) and the Hijri values
export interface HijriDate {
  date: Date; // Gregorian date for internal use
  hijri: {
    year: number;
    month: number;
    day: number;
  };
}

// Generate calendar days
function getCalendarDays(year: number, month: number) {
  const daysInMonth = getDaysInHijriMonth(year, month);
  const firstDayDate = getGregorianFromHijri(year, month, 1);
  const firstDayOfWeek = firstDayDate.getDay(); // 0 = Sunday, 6 = Saturday

  const days: {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    hijriDay: number;
    hijriMonth: number;
  }[] = [];

  // Add previous month's days
  const previousMonth = month === 0 ? 11 : month - 1;
  const previousYear = month === 0 ? year - 1 : year;
  const daysInPreviousMonth = getDaysInHijriMonth(previousYear, previousMonth);

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const hijriDay = daysInPreviousMonth - i;
    const date = getGregorianFromHijri(previousYear, previousMonth, hijriDay);
    days.push({ date, day: hijriDay, isCurrentMonth: false, hijriDay, hijriMonth: previousMonth });
  }

  // Add current month's days
  for (let hijriDay = 1; hijriDay <= daysInMonth; hijriDay++) {
    const date = getGregorianFromHijri(year, month, hijriDay);
    days.push({ date, day: hijriDay, isCurrentMonth: true, hijriDay, hijriMonth: month });
  }

  // Add next month's days to complete the grid (6 rows x 7 days = 42 cells)
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remainingDays = 42 - days.length;

  for (let hijriDay = 1; hijriDay <= remainingDays; hijriDay++) {
    const date = getGregorianFromHijri(nextYear, nextMonth, hijriDay);
    days.push({ date, day: hijriDay, isCurrentMonth: false, hijriDay, hijriMonth: nextMonth });
  }

  return days;
}

// Check if two dates are the same day
function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

// Check if a date is between two dates
function isDateInRange(date: Date, startDate: Date, endDate: Date) {
  return date >= startDate && date <= endDate;
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
  const { year: currentHijriYear, month: currentHijriMonth } = getHijriDate(today);

  const [hijriMonth, setHijriMonth] = React.useState(currentHijriMonth);
  const [hijriYear, setHijriYear] = React.useState(currentHijriYear);
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
      const isBeforeStart = date < selectedDates.start;
      const start = isBeforeStart ? date : selectedDates.start;
      const end = isBeforeStart ? selectedDates.start : date;
      onSelect?.([start, end] as Date[]);
    }
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    if (hijriMonth === 0) {
      setHijriMonth(11);
      setHijriYear(hijriYear - 1);
    } else {
      setHijriMonth(hijriMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (hijriMonth === 11) {
      setHijriMonth(0);
      setHijriYear(hijriYear + 1);
    } else {
      setHijriMonth(hijriMonth + 1);
    }
  };

  // Navigate to today
  const handleGoToToday = () => {
    setHijriMonth(currentHijriMonth);
    setHijriYear(currentHijriYear);
  };

  // Get calendar grid
  const days = getCalendarDays(hijriYear, hijriMonth);

  return (
    <div className={cn('p-3 select-none', className)} dir="rtl" {...props}>
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-medium text-right">
          {HIJRI_MONTHS[hijriMonth]} {hijriYear}
        </div>
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
        {WEEKDAYS.map(day => (
          <div key={day} className="text-xs text-muted-foreground text-center py-1.5">
            {day.substring(0, 1)}
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
            (hoveredDate > selectedDates.start
              ? isDateInRange(day.date, selectedDates.start, hoveredDate)
              : isDateInRange(day.date, hoveredDate, selectedDates.start));
          const isToday = isSameDay(day.date, today);
          const isDisabled = disabled && disabled(day.date);

          // Check if this is a date that requires moon sighting verification
          const isUncertain = isUncertainDate(day.hijriDay, day.hijriMonth);

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
                {day.hijriDay}
              </button>

              {/* Today indicator dot */}
              {isToday && (
                <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2"></div>
              )}

              {/* Moon sighting uncertainty indicator */}
              {isUncertain && (
                <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-yellow-400 rounded-full -translate-x-1/2"></div>
              )}
            </div>
          );

          // Wrap in tooltip if it's an uncertain date
          if (isUncertain) {
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
                <TooltipContent>
                  <p dir="rtl">⚠️ قد لا يكون هذا التاريخ دقيقًا. يرجى التحقق من رؤية الهلال.</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          // Return normal date cell
          return <div key={index}>{cellContent}</div>;
        })}
      </div>
    </div>
  );
}
