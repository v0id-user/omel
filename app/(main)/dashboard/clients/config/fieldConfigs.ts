import { FormFieldConfig } from '../types';
import { z } from 'zod';
import { clientValidateEmailInput, clientValidatePhoneInput } from '@/utils/client/validators';

// Basic Info Fields
export const basicInfoFields: FormFieldConfig[] = [
  {
    name: 'name',
    label: 'الاسم',
    isRequired: true,
    validator: value => {
      if (!value) return 'الاسم مطلوب';
      return undefined;
    },
  },
  {
    name: 'email',
    label: 'البريد الإلكتروني',
    type: 'email',
    isRequired: true,
    validator: value => {
      if (!value) return 'البريد الإلكتروني مطلوب';
      return clientValidateEmailInput(value);
    },
  },
];

// Contact Info Fields
export const contactInfoFields: FormFieldConfig[] = [
  {
    name: 'phone',
    label: 'رقم الهاتف',
    validator: value => {
      if (value) {
        return clientValidatePhoneInput(value);
      }
      return undefined;
    },
  },
  { name: 'address', label: 'العنوان' },
  { name: 'city', label: 'المدينة' },
  { name: 'region', label: 'المنطقة' },
  { name: 'country', label: 'البلد' },
  { name: 'postalCode', label: 'الرمز البريدي' },
];

// Company Fields
export const companyFields: FormFieldConfig[] = [
  {
    name: 'companyFields.domain',
    label: 'الموقع الإلكتروني',
    isRequired: false,
    validator: value => {
      if (!value) return 'عنوان الموقع مطلوب للشركات';
      const domainSchema = z.string().url().optional();
      const result = domainSchema.safeParse(value);
      if (!result.success) {
        return 'عنوان الموقع غير صالح';
      }
      return undefined;
    },
  },
  {
    name: 'companyFields.taxId',
    label: 'الرقم الضريبي',
    isRequired: false,
    validator: value => {
      if (!value) return 'الرقم الضريبي مطلوب للشركات';
      return undefined;
    },
  },
  {
    name: 'companyFields.businessType',
    label: 'نوع النشاط التجاري',
    isRequired: true,
    validator: value => {
      if (!value) return 'نوع النشاط التجاري مطلوب للشركات';
      return undefined;
    },
  },
  {
    name: 'companyFields.employees',
    label: 'عدد الموظفين',
    isRequired: false,
  },
];
