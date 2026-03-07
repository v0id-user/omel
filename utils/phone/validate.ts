import parsePhoneNumberFromString from 'libphonenumber-js/max';
import { clientValidatePhoneInput } from '../client/validators';
import { toEnglishNumerals } from '..';
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

function validatePhoneArab(input: string) {
  let normalizedInput = toEnglishNumerals(input.trim());
  if (normalizedInput[0] !== '+') {
    normalizedInput = '+' + normalizedInput;
  }

  // TODO: This is not good, refactor it
  const phone = clientValidatePhoneInput(normalizedInput);
  if (phone !== undefined) return false;

  const parsedPhone = parsePhoneNumberFromString(normalizedInput);
  if (!parsedPhone?.country) return false;

  // For now we only support arab countries
  for (const region of arabRegions) {
    if (parsedPhone.country === region) {
      return true;
    }
  }
  return false;
}

function validatePhoneGeneral(input: string) {
  const phone = clientValidatePhoneInput(input);
  if (phone !== undefined) return false;

  return phone;
}

export { validatePhoneArab, validatePhoneGeneral };
