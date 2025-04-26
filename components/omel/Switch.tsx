'use client';

import { useState } from 'react';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: '16' | '24';
  disabled?: boolean;
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
}

function SwitchThumb({ isChecked, size }: { isChecked: boolean; size: '16' | '24' }) {
  // For proper RTL support with precise positioning
  const translateClass =
    size === '16'
      ? isChecked
        ? 'translate-x-[8px] rtl:-translate-x-[8px]'
        : 'translate-x-[1px] rtl:-translate-x-[1px]'
      : isChecked
        ? 'translate-x-[14px] rtl:-translate-x-[14px]'
        : 'translate-x-[1px] rtl:-translate-x-[1px]';

  return (
    <div
      className={`
        absolute top-[1px] left-[0px] rtl:left-auto rtl:right-[0px]
        ${!isChecked && 'ring-1 ring-gray-200'}
        bg-white rounded-full shadow-sm
        transform transition-transform duration-200 ease-in-out will-change-transform
        ${translateClass}
        ${size === '16' ? 'h-[14px] w-[14px]' : 'h-[22px] w-[22px]'}
      `}
    />
  );
}

function SwitchRoot({
  isChecked,
  disabled,
  size,
  onClick,
  children,
  label,
  labelClassName,
  containerClassName,
}: {
  isChecked: boolean;
  disabled: boolean;
  size: '16' | '24';
  onClick: () => void;
  children: React.ReactNode;
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${containerClassName || ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        data-state={isChecked ? 'checked' : 'unchecked'}
        data-size={size}
        onClick={onClick}
        disabled={disabled}
        className={`
          outline-none border-none m-0 p-0 relative rounded-full
          transition-colors duration-200 flex-shrink-0
          ${isChecked ? 'bg-black' : 'bg-[rgba(35,37,41,0.06)]'}
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${size === '16' ? 'h-[16px] w-[24px]' : 'h-[24px] w-[38px]'}
        `}
      >
        {children}
      </button>

      {label && (
        <label
          className={labelClassName || `text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
        >
          {label}
        </label>
      )}
    </div>
  );
}

export function Switch({
  checked = false,
  onChange,
  size = '16',
  disabled = false,
  label,
  labelClassName,
  containerClassName,
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <SwitchRoot
      isChecked={isChecked}
      disabled={disabled}
      size={size}
      onClick={handleToggle}
      label={label}
      labelClassName={labelClassName}
      containerClassName={containerClassName}
    >
      <SwitchThumb isChecked={isChecked} size={size} />
    </SwitchRoot>
  );
}
