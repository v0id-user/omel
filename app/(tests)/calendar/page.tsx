import React from 'react';
import { CalendarExample } from './CalendarExample';

export default function CalendarTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-right mb-6">تقويم هجري</h1>
      <CalendarExample />
    </div>
  );
}
