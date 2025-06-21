'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import { toArabicNumerals, toEnglishNumerals } from '@/utils';
import { allowedRegions } from '@/lib/countryCodes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  isRequired?: boolean;
  error?: string;
  icon?: ReactNode;
  className?: string;
  inputClassName?: string;
}

export function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  isRequired = false,
  error,
  icon,
  className = '',
  inputClassName = '',
}: FormFieldProps) {
  const [internalError, setInternalError] = useState<string | undefined>(error);
  const [selectedCountry, setSelectedCountry] = useState(allowedRegions[0]);

  // Update internal error when external error changes
  useEffect(() => {
    setInternalError(error);
  }, [error]);

  // Parse phone number to extract country code and number
  useEffect(() => {
    if (type === 'phone' && value) {
      // Find country by checking if value starts with +countryCode
      const country = allowedRegions.find(region => value.startsWith(`+${region.phoneCode}`));
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [value, type]);

  // Get the phone number without country code for display
  const getPhoneNumberOnly = (): string => {
    if (type === 'phone' && value) {
      const countryCodeWithPlus = `+${selectedCountry.phoneCode}`;
      if (value.startsWith(countryCodeWithPlus)) {
        return value.substring(countryCodeWithPlus.length);
      }
    }
    return type === 'phone' ? '' : value;
  };

  // Validate field value
  const validateField = (value: string): string | undefined => {
    // Validate required field
    if (isRequired && (!value || value.trim() === '')) {
      return `${label} مطلوب`;
    }
    return undefined;
  };

  // Handle blur event for validation
  const handleBlur = () => {
    const validationError = validateField(value);
    setInternalError(validationError);
  };

  // Handle change with validation
  const handleChange = (newValue: string) => {
    onChange(newValue);

    // Clear error when user starts typing
    if (internalError && newValue.trim() !== '') {
      setInternalError(undefined);
    }
  };

  const handleCountrySelect = (country: (typeof allowedRegions)[0]) => {
    setSelectedCountry(country);
    // Update the value with new country code, keeping existing phone number
    const phoneNumber = getPhoneNumberOnly();
    const newValue = `+${country.phoneCode}${phoneNumber}`;
    onChange(newValue);
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    // Convert Arabic numerals to English for storage
    const englishNumber = toEnglishNumerals(phoneNumber);
    // Combine with country code
    const fullNumber = `+${selectedCountry.phoneCode}${englishNumber}`;
    onChange(fullNumber);
  };

  if (type === 'phone') {
    const displayPhoneNumber = getPhoneNumberOnly();

    return (
      <div className={`space-y-1 ${className}`}>
        <div className="flex justify-between mb-1">
          <label htmlFor={name} className="text-sm text-gray-600">
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
        </div>
        <div
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${internalError ? 'border-red-500' : ''} ${inputClassName}`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-row items-center cursor-pointer gap-2.5 hover:bg-gray-50 rounded px-1 transition-colors">
                <span className="font-medium text-gray-600">{selectedCountry.name}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[200px] max-h-[300px] overflow-y-auto bg-white border rounded-md z-[999]"
              align="start"
              sideOffset={4}
            >
              {allowedRegions.map(region => (
                <DropdownMenuItem
                  key={region.code}
                  onClick={() => handleCountrySelect(region)}
                  className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                  dir="rtl"
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="text-gray-500 text-xs font-mono">
                      {toArabicNumerals(region.phoneCode)}+
                    </span>
                    <span className="text-sm">{region.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            id={name}
            placeholder={toArabicNumerals('123456789')}
            value={toArabicNumerals(displayPhoneNumber)}
            onChange={e => handlePhoneNumberChange(e.target.value)}
            onBlur={handleBlur}
            type="tel"
            className="flex-1 pr-5 outline-none border-none focus:outline-none focus:border-none shadow-none text-left bg-transparent"
            style={{ boxShadow: 'none' }}
          />
          <span className="text-gray-400 pr-5">{toArabicNumerals(selectedCountry.phoneCode)}+</span>
        </div>
        {internalError && <p className="text-red-500 text-sm mt-1">{internalError}</p>}
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between mb-1">
        <label htmlFor={name} className="text-sm text-gray-600">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      </div>
      <div className="relative">
        <Input
          id={name}
          type={type}
          placeholder={placeholder || label}
          value={value}
          onChange={e => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={`${internalError ? 'border-red-500' : ''} ${inputClassName}`}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {internalError && <p className="text-red-500 text-sm mt-1">{internalError}</p>}
    </div>
  );
}
