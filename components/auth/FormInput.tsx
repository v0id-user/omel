import { ReactNode, Ref } from 'react';

interface FormInputProps {
  type: string;
  value: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: ReactNode;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: Ref<HTMLInputElement>;
}
function AuthFormInput({
  type,
  value,
  onBlur,
  onChange,
  placeholder,
  icon,
  disabled,
  onKeyDown,
  inputRef,
}: FormInputProps) {
  return (
    <div className="relative h-[42px]">
      <input
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        ref={inputRef}
        placeholder={placeholder}
        className="w-full h-full p-3 pl-10 bg-transparent border rounded-md text-black placeholder-gray-400 
          focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30
          aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30
          transition-all duration-200 ease-in-out shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>
    </div>
  );
}

export default AuthFormInput;
