import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SorterProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: { value: string; label: string }[];
  label?: string;
  placeholder?: string;
  className?: string;
}

export function Sorter({
  value,
  onValueChange,
  options,
  label = 'ترتيب حسب',
  placeholder = 'اختر...',
  className,
}: SorterProps) {
  return (
    <Select dir="rtl" value={value} onValueChange={onValueChange}>
      <SelectTrigger dir="rtl" className={className}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 border-l border-gray-200 pl-2">{label}</span>
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value} dir="rtl">
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
