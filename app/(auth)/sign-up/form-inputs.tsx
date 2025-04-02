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

// TODO: Fix, use any and add an expection for it
export const EmailInput = () => {
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
          <div className="relative">
            <input
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="ادخل بريد العمل الخاص بك"
              className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
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

export const PasswordInput = () => {
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
          <div className="relative">
            <input
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="ادخل كلمة المرور"
              className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
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
            <input
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="اسمك الأول"
              className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}
      </form.Field>
      <form.Field name="personalInfo.lastName">
        {field => (
          <>
            <input
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="اسمك الأخير"
              className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="relative">
            <input
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="رقم الهاتف"
              className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Phone
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </>
      )}
    </form.Field>
  );
};
