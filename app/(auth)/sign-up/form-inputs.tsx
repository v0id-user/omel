import { useForm } from '@tanstack/react-form';
import { Mail, Lock, Phone } from 'lucide-react';
import { clientValidateEmailInput, clientValidatePasswordInput } from '@/utils/client/validators';
import FormInput from '@/components/auth/FormInput';
import { useSignUpStore } from './store';

export const EmailField = () => {
  const { userInfo, setUserInfo } = useSignUpStore();
  const form = useForm({
    defaultValues: userInfo,
  });
  return (
    <form.Field
      name="email"
      validators={{
        onBlur: ({ value }) => clientValidateEmailInput(value),
      }}
    >
      {field => (
        <>
          <FormInput
            type="email"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={email => {
              field.handleChange(email);
              setUserInfo({ ...userInfo, email });
            }}
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
  const { userInfo, setUserInfo } = useSignUpStore();
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
            onChange={password => {
              field.handleChange(password);
              setUserInfo({ ...userInfo, password });
            }}
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
  const { userInfo, setUserInfo } = useSignUpStore();
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
              onChange={firstName => {
                field.handleChange(firstName);
                setUserInfo({ ...userInfo, personalInfo: { ...userInfo.personalInfo, firstName } });
              }}
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
              onChange={lastName => {
                field.handleChange(lastName);
                setUserInfo({ ...userInfo, personalInfo: { ...userInfo.personalInfo, lastName } });
              }}
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
  const { userInfo, setUserInfo } = useSignUpStore();
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
            onChange={phone => {
              field.handleChange(phone);
              setUserInfo({ ...userInfo, personalInfo: { ...userInfo.personalInfo, phone } });
            }}
            placeholder="رقم الهاتف"
            icon={<Phone size={18} />}
          />
        </>
      )}
    </form.Field>
  );
};
