import { z } from 'zod';
import { validateEmail } from '@/utils/emails';
import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { clientValidatePhoneInput } from '@/utils/client/validators';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';

const arabRegions = [
  'SA',
  'AE',
  'EG',
  'QA',
  'KW',
  'BH',
  'OM',
  'JO',
  'LB',
  'SY',
  'IQ',
  'YE',
  'MA',
  'DZ',
  'TN',
  'LY',
  'SD',
  'PS',
];

export const validationsRouter = createTRPCRouter({
  validateEmail: baseProcedure.input(z.string().email()).mutation(async ({ input }) => {
    return await validateEmail(input);
  }),
  validatePhone: baseProcedure.input(z.string()).mutation(async ({ input }) => {
    // TODO: This is not good, refactor it
    const phone = clientValidatePhoneInput(input);
    if (phone !== undefined) return false;

    const parsedPhone = parsePhoneNumberFromString(input);
    if (!parsedPhone?.country) return false;

    // For now we only support arab countries
    for (const region of arabRegions) {
      console.log(parsedPhone.country, region);
      if (parsedPhone.country === region) {
        return true;
      }
    }
    return false;
  }),
});
