'use client';

import React, { useState } from 'react';
import { Calendar, formatGregorianDateArabic } from '@/components/ui/calendar';

export function CalendarExample() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [dateRange, setDateRange] = useState<Date[] | null>([new Date()]);

  // Handle single date selection
  const handleSelect = (selectedDate: Date | Date[] | null) => {
    if (selectedDate instanceof Date) {
      setDate(selectedDate);
    } else {
      setDate(null);
    }
  };

  // Handle date range selection
  const handleRangeSelect = (selectedDates: Date | Date[] | null) => {
    if (Array.isArray(selectedDates)) {
      setDateRange(selectedDates);
    } else if (selectedDates instanceof Date) {
      setDateRange([selectedDates]);
    } else {
      setDateRange(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center p-6" dir="rtl">
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <h2 className="text-lg font-medium mb-4 text-right">تقويم (اختيار يوم واحد)</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          className="rounded-md border"
        />
        <p className="mt-4 text-sm text-muted-foreground text-right">
          {date ? `التاريخ المحدد: ${formatGregorianDateArabic(date)}` : 'لم يتم اختيار تاريخ'}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <h2 className="text-lg font-medium mb-4 text-right">تقويم (اختيار نطاق)</h2>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleRangeSelect}
          className="rounded-md border"
        />
        <p className="mt-4 text-sm text-muted-foreground text-right">
          {dateRange && dateRange[0] ? (
            dateRange[1] ? (
              <>
                من: {formatGregorianDateArabic(dateRange[0])}
                <br />
                إلى: {formatGregorianDateArabic(dateRange[1])}
              </>
            ) : (
              `البداية: ${formatGregorianDateArabic(dateRange[0])}`
            )
          ) : (
            'لم يتم اختيار نطاق'
          )}
        </p>
      </div>
    </div>
  );
}
