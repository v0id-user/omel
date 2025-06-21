'use client';

import { useForm } from '@tanstack/react-form';
import { Mail, Lock, Phone } from 'lucide-react';
import {
  clientValidateEmailInput,
  clientValidatePasswordInput,
  clientValidatePhoneInput,
} from '@/utils/client/validators';
import { AuthFormInput } from '@/components/auth';
import { useAuthStore } from '@/store/auth/userInfo';
import { useState, useCallback, useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { allowedRegions } from '@/lib/countryCodes';
import { toArabicNumerals, toEnglishNumerals } from '@/utils';
import { log } from '@/utils/logs';

// Custom FormInput for phone field to match Select height
const PhoneFormInput = (props: React.ComponentProps<typeof AuthFormInput>) => {
  return (
    <div className="relative h-[42px]">
      <input
        type={props.type}
        value={props.value}
        onBlur={props.onBlur}
        onChange={e => props.onChange(e.target.value)}
        onKeyDown={props.onKeyDown}
        ref={props.inputRef}
        placeholder={props.placeholder}
        className="w-full h-full p-3 pl-10 bg-transparent border rounded-md text-black placeholder-gray-400 
          focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30
          aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30
          transition-all duration-200 ease-in-out shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={props.disabled}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {props.icon}
      </div>
    </div>
  );
};

export const EmailField = () => {
  const { userInfo, setUserInfo } = useAuthStore();
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
          <AuthFormInput
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
  const { userInfo, setUserInfo } = useAuthStore();
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
          <AuthFormInput
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
  const { userInfo, setUserInfo } = useAuthStore();
  const form = useForm({
    defaultValues: userInfo,
  });
  const lastNameInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2 items-center">
      <form.Field
        name="personalInfo.firstName"
        validators={{
          onChange: ({ value }) => {
            if (!value) {
              return 'اسمك الأول مطلوب';
            }
            if (value.includes(' ')) {
              return 'لا يمكن إضافة مسافات في الاسم الأول';
            }
          },
        }}
      >
        {field => (
          <>
            <AuthFormInput
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={firstName => {
                const sanitizedName = firstName.replace(/\s/g, '');
                field.handleChange(sanitizedName);
                setUserInfo({
                  ...userInfo,
                  personalInfo: { ...userInfo.personalInfo, firstName: sanitizedName },
                });
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === ' ' && lastNameInputRef.current) {
                  e.preventDefault();
                  lastNameInputRef.current.focus();
                }
              }}
              placeholder="اسمك الأول"
              icon={<></>}
            />
            {field.state.meta.errors && (
              <em className="text-red-500 text-sm block mt-1">
                {field.state.meta.errors.join(', ')}
              </em>
            )}
          </>
        )}
      </form.Field>
      <form.Field
        name="personalInfo.lastName"
        validators={{
          onChange: ({ value }) => {
            if (!value) {
              return 'اسمك الأخير مطلوب';
            }
            if (value.includes(' ')) {
              return 'لا يمكن إضافة مسافات في الاسم الأخير';
            }
          },
        }}
      >
        {field => (
          <>
            <AuthFormInput
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={lastName => {
                const sanitizedName = lastName.replace(/\s/g, '');
                field.handleChange(sanitizedName);
                setUserInfo({
                  ...userInfo,
                  personalInfo: { ...userInfo.personalInfo, lastName: sanitizedName },
                });
              }}
              inputRef={lastNameInputRef}
              placeholder="اسمك الأخير"
              icon={<></>}
            />
            {field.state.meta.errors && (
              <em className="text-red-500 text-sm block mt-1">
                {field.state.meta.errors.join(', ')}
              </em>
            )}
          </>
        )}
      </form.Field>
    </div>
  );
};

const PhoneSelect = ({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) => {
  return (
    <Select dir="rtl" value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className="w-[140px] h-[42px] text-xs font-medium text-gray-700 bg-white border rounded-md
        focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30
        aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30
        transition-all duration-200 ease-in-out shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
        px-2 flex items-center"
      >
        <SelectValue placeholder="اختر الدولة" className="text-xs" />
      </SelectTrigger>
      <SelectContent className="w-[200px] max-h-[300px] overflow-y-auto text-sm font-medium bg-white border rounded-md shadow-lg z-[999]">
        {allowedRegions.map(region => (
          <SelectItem key={region.code} value={region.phoneCode} className="relative" dir="rtl">
            <div className="flex w-full items-center gap-2">
              <span className="text-gray-500 text-xs font-mono">
                {toArabicNumerals(region.phoneCode)}+
              </span>
              <span className="text-sm">{region.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const PhoneField = () => {
  const { userInfo, setUserInfo } = useAuthStore();
  const [selectedDialCode, setSelectedDialCode] = useState<string>('966'); // Default to Saudi Arabia
  const [rawNumber, setRawNumber] = useState<string>('');
  const form = useForm({
    defaultValues: userInfo,
  });

  const validateAndUpdatePhone = useCallback(
    (number: string, dialCode: string) => {
      const fullPhoneNumber = `${dialCode}${number}`;
      const phoneNumber = clientValidatePhoneInput(fullPhoneNumber);

      if (phoneNumber === undefined) {
        console.log('(validateAndUpdatePhone) Phone number is valid', fullPhoneNumber);
        setUserInfo({
          ...userInfo,
          personalInfo: {
            ...userInfo.personalInfo,
            phone: fullPhoneNumber,
          },
        });
        console.log('Updated personalInfo', userInfo.personalInfo);
        return true;
      } else {
        console.log('(validateAndUpdatePhone) Phone number is invalid', fullPhoneNumber);
        return false;
      }
    },
    [userInfo, setUserInfo]
  );

  return (
    <form.Field
      name="personalInfo.phone"
      validators={{
        onChange: ({ value }) => {
          const phoneNumber = clientValidatePhoneInput(value);
          if (phoneNumber !== undefined) {
            console.log(
              log({
                component: 'PhoneField',
                message: `Phone number was not vaild ${value}`,
              })
            );
            return 'رقم الهاتف غير صحيح';
          }
        },
      }}
    >
      {field => (
        <>
          <div className="flex gap-4 items-center px-2">
            <div className="flex-1">
              <PhoneFormInput
                type="tel"
                value={toArabicNumerals(rawNumber)}
                onBlur={() => {
                  field.handleBlur();
                  validateAndUpdatePhone(rawNumber, selectedDialCode);
                }}
                onChange={number => {
                  // Values here depend on whatever in the value
                  const numberEn = toEnglishNumerals(number);
                  const cleanNumber = numberEn.replace(/[^\d]/g, '');
                  console.log(
                    log({
                      component: 'PhoneField',
                      message: `cleaned phone number ${cleanNumber}`,
                    })
                  );
                  setRawNumber(cleanNumber);

                  const fullPhoneNumber = `${selectedDialCode}${cleanNumber}`;
                  field.handleChange(fullPhoneNumber);

                  validateAndUpdatePhone(cleanNumber, selectedDialCode);
                }}
                placeholder="أدخل رقم هاتفك"
                icon={<Phone className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <div className="flex flex-col">
              <PhoneSelect
                value={selectedDialCode}
                onValueChange={value => {
                  setSelectedDialCode(value);
                  validateAndUpdatePhone(rawNumber, value);
                }}
              />
            </div>
          </div>
          {field.state.meta.errors && (
            <em className="text-destructive text-sm block mt-1 text-right">
              {field.state.meta.errors.join(', ')}
            </em>
          )}
        </>
      )}
    </form.Field>
  );
};

export const CompanyNameField = () => {
  const { userInfo, setUserInfo } = useAuthStore();
  const form = useForm({
    defaultValues: userInfo,
  });
  return (
    <form.Field
      name="companyInfo.name"
      validators={{
        onChange: ({ value }) => {
          if (!value) {
            return 'اسم الشركة مطلوب';
          }
        },
      }}
    >
      {field => (
        <>
          <AuthFormInput
            type="text"
            value={field.state.value || ''}
            onBlur={field.handleBlur}
            onChange={name => {
              field.handleChange(name);
              setUserInfo({
                ...userInfo,
                companyInfo: { ...userInfo.companyInfo, name },
              });
            }}
            placeholder="اسم الشركة"
            icon={<></>}
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

export const CompanyAddressField = () => {
  const { userInfo, setUserInfo } = useAuthStore();
  const form = useForm({
    defaultValues: userInfo,
  });
  return (
    <form.Field
      name="companyInfo.address"
      validators={{
        onChange: ({ value }) => {
          if (!value) {
            return 'عنوان الشركة مطلوب';
          }
        },
      }}
    >
      {field => (
        <>
          <AuthFormInput
            type="text"
            value={field.state.value || ''}
            onBlur={field.handleBlur}
            onChange={address => {
              field.handleChange(address);
              setUserInfo({
                ...userInfo,
                companyInfo: { ...userInfo.companyInfo, address },
              });
            }}
            placeholder="عنوان الشركة"
            icon={<></>}
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

export const CompanyWebsiteField = () => {
  const { userInfo, setUserInfo } = useAuthStore();
  const form = useForm({
    defaultValues: userInfo,
  });
  return (
    <form.Field
      name="companyInfo.website"
      validators={{
        onChange: ({ value }) => {
          if (value && !value.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
            return 'الموقع الإلكتروني غير صالح';
          }
        },
      }}
    >
      {field => (
        <>
          <AuthFormInput
            type="text"
            value={field.state.value || ''}
            onBlur={field.handleBlur}
            onChange={website => {
              field.handleChange(website);
              setUserInfo({
                ...userInfo,
                companyInfo: { ...userInfo.companyInfo, website },
              });
            }}
            placeholder="الموقع الإلكتروني للشركة (اختياري)"
            icon={<></>}
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

export const CompanySizeField = () => {
  const { userInfo, setUserInfo } = useAuthStore();
  const form = useForm({
    defaultValues: userInfo,
  });

  const sizeOptions = [
    { value: '10-99', label: '10-99 موظف' },
    { value: '100-499', label: '100-499 موظف' },
    { value: '500-999', label: '500-999 موظف' },
    { value: '1000-4999', label: '1000-4999 موظف' },
    { value: '5000+', label: '5000+ موظف' },
  ];

  return (
    <form.Field
      name="companyInfo.size"
      validators={{
        onChange: ({ value }) => {
          if (!value) {
            return 'حجم الشركة مطلوب';
          }
        },
      }}
    >
      {field => (
        <>
          <Select
            dir="rtl"
            value={field.state.value || ''}
            onValueChange={(size: '10-99' | '100-499' | '500-999' | '1000-4999' | '5000+') => {
              field.handleChange(size);
              setUserInfo({
                ...userInfo,
                companyInfo: { ...userInfo.companyInfo, size },
              });
            }}
          >
            <SelectTrigger
              className="w-full h-[42px] text-xs font-medium text-gray-700 bg-white border rounded-md
              focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30
              aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30
              transition-all duration-200 ease-in-out shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
              px-2 flex items-center"
            >
              <SelectValue placeholder="اختر حجم الشركة" className="text-xs" />
            </SelectTrigger>
            <SelectContent className="w-full max-h-[300px] overflow-y-auto text-sm font-medium bg-white border rounded-md shadow-lg z-[999]">
              {sizeOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="relative" dir="rtl">
                  <div className="flex w-full items-center gap-2">
                    <span className="text-sm">{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

// Component to render all company fields in a better layout
export const CompanyFields = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-xs font-light text-right text-gray-400">*معلومات الشركة الأساسية</h3>
          <CompanyNameField />
          <CompanyAddressField />
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-light text-right text-gray-400">*معلومات إضافية</h3>
          <CompanySizeField />
          <CompanyWebsiteField />
        </div>
      </div>
    </div>
  );
};
