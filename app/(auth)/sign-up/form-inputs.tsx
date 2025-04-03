import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Mail, Lock, Phone } from 'lucide-react';
import { clientValidatePasswordInput } from './validations';
import FormInput from '@/components/auth/FormInput';
import { useSignUpStore } from './store';

export const EmailField = () => {
  const { userInfo } = useSignUpStore();
  const form = useForm({
    defaultValues: userInfo,
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
  const { userInfo } = useSignUpStore();
  const form = useForm({
    defaultValues: userInfo,
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
  const { userInfo } = useSignUpStore();
  const form = useForm({
    defaultValues: userInfo,
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
  const { userInfo } = useSignUpStore();
  const form = useForm({
    defaultValues: userInfo,
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
