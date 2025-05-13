'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

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

  // Update internal error when external error changes
  useEffect(() => {
    setInternalError(error);
  }, [error]);

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

// Type definitions for TanStack Form
interface FieldState {
  value: string;
  meta: {
    errors?: string[];
  };
}

interface FieldApi {
  handleChange: (value: string) => void;
  handleBlur: () => void;
  state: FieldState;
}

interface FormContextType<TFormValues> {
  Field: {
    (props: {
      name: string;
      validators?: {
        onChange?: (options: { value: string }) => string | undefined;
        onBlur?: (options: { value: string }) => string | undefined;
      };
      children: (field: FieldApi) => React.ReactNode;
    }): React.ReactNode;
  };
  state: {
    values: TFormValues;
  };
}

export function TanstackFormField<TFormValues>({
  name,
  label,
  placeholder,
  type = 'text',
  isRequired = false,
  icon,
  className = '',
  inputClassName = '',
  validator,
  form,
  fieldValueSetter,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  isRequired?: boolean;
  icon?: ReactNode;
  className?: string;
  inputClassName?: string;
  validator?: (value: string) => string | undefined;
  form: FormContextType<TFormValues>;
  fieldValueSetter?: (values: TFormValues, value: string) => void;
}) {
  // Combine validators
  const combinedValidator = (value: string): string | undefined => {
    // First check required field
    if (isRequired && (!value || value.trim() === '')) {
      return `${label} مطلوب`;
    }
    // Then run custom validator if provided
    if (validator) {
      return validator(value);
    }
    return undefined;
  };

  return (
    <form.Field
      name={name}
      validators={{
        onChange: ({ value }: { value: string }) => combinedValidator(value),
        onBlur: ({ value }: { value: string }) => combinedValidator(value),
      }}
    >
      {(field: FieldApi) => (
        <FormField
          label={label}
          name={name}
          value={field.state.value || ''}
          onChange={value => {
            field.handleChange(value);
            if (fieldValueSetter) {
              const currentValues = form.state.values;
              fieldValueSetter(currentValues, value);
            }
          }}
          placeholder={placeholder || label}
          type={type}
          isRequired={isRequired}
          error={field.state.meta.errors?.join(', ')}
          icon={icon}
          className={className}
          inputClassName={inputClassName}
        />
      )}
    </form.Field>
  );
}
