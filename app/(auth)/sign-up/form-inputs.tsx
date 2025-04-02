import { formOptions, useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { UserInfo } from './interfaces';
import { Mail, Lock, Phone } from 'lucide-react';
import { clientValidatePasswordInput } from './validations';

export const userInfo = formOptions({
  defaultValues: {
    email: '',
    password: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      phone: '',
    },
    companyInfo: {
      name: '',
      phone: '',
    },
  } as UserInfo,
});
import { ReactNode } from 'react';

interface FormInputProps {
  type: string;
  value: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  icon: ReactNode;
}
const FormInput = ({ type, value, onBlur, onChange, placeholder, icon }: FormInputProps) => {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 pl-10 bg-transparent border rounded-md text-black placeholder-gray-400 
        focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30
        aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30
        transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>
    </div>
  );
};

export const EmailField = () => {
  const form = useForm({
    ...userInfo,
  });
  return (
    <form.Field
      name="email"
      validators={{
        onChange: ({ value }) => {
          if (!value) {
            return 'يجب إدخال بريد العمل الخاص بك';
          }

          if (!z.string().email().safeParse(value).success) {
            return 'بريد العمل الإلكتروني غير صالح';
          }
          return undefined;
        },
      }}
    >
      {field => (
        <>
          <FormInput
            type="email"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            placeholder="ادخل بريد العمل الخاص بك"
            icon={<Mail size={20} />}
          />
          {field.state.meta.errors && (
            <em className="text-red-500 text-sm block mt-1">
              {field.state.meta.errors.join(', ')}
            </em>
          )}
        </>
      )}
    </form.Field>
  );
};

export const PasswordField = () => {
  const form = useForm({
    ...userInfo,
  });
  return (
    <form.Field
      name="password"
      validators={{
        onChange: ({ value }) => clientValidatePasswordInput(value),
      }}
    >
      {field => (
        <>
          <FormInput
            type="password"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            placeholder="ادخل كلمة المرور"
            icon={<Lock size={18} />}
          />
          {field.state.meta.errors && (
            <em className="text-red-500 text-sm block mt-1">
              {field.state.meta.errors.join(', ')}
            </em>
          )}
        </>
      )}
    </form.Field>
  );
};

export const NameFields = () => {
  const form = useForm({
    ...userInfo,
  });
  return (
    <div className="flex gap-4">
      <form.Field name="personalInfo.firstName">
        {field => (
          <>
            <FormInput
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              placeholder="اسمك الأول"
              icon={<></>}
            />
          </>
        )}
      </form.Field>
      <form.Field name="personalInfo.lastName">
        {field => (
          <>
            <FormInput
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              placeholder="اسمك الأخير"
              icon={<></>}
            />
          </>
        )}
      </form.Field>
    </div>
  );
};

export const PhoneField = () => {
  const form = useForm({
    ...userInfo,
  });
  return (
    <form.Field name="personalInfo.phone">
      {field => (
        <>
          <FormInput
            type="text"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            placeholder="رقم الهاتف"
            icon={<Phone size={18} />}
          />
        </>
      )}
    </form.Field>
  );
};
