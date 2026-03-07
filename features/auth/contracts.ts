import { z } from 'zod';

export const companySizeSchema = z.enum([
  '1-9',
  '10-99',
  '100-499',
  '500-999',
  '1000-4999',
  '5000+',
]);

export const personalInfoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
});

export const companyInfoSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  size: companySizeSchema.optional(),
});

export const newCRMUserInfoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  personalInfo: personalInfoSchema,
  companyInfo: companyInfoSchema,
});

export type NewCRMUserInfoInput = z.infer<typeof newCRMUserInfoSchema>;
